import express from "express";//Express is the web framework you’re using to handle HTTP requests and responses.Express gives you a clean way to define routes, middleware, and error handling instead of writing raw Node.js http servers.
import dotenv from "dotenv";
dotenv.config();//Loads environment variables from a .env file into process.env.
import connectDB from "./src/config/mongo.config.js";//connectDB initializes Mongoose and connects to your MongoDB cluster.
import shortUrl from "./src/routes/shortUrl.route.js";
import auth_routes from "./src/routes/auth.routes.js";
import user_routes from "./src/routes/user.routes.js";
import redirect_routes from "./src/routes/redirect.routes.js";
import { errorHandler } from "./src/utils/errorHandler.js";//A centralized error handler middleware.
import cors from "cors";//Enables Cross-Origin Resource Sharing so your frontend (React, on a different domain/port) can make requests to your backend.
import { attachUser } from "./src/utils/attachUser.js";//a middleware that reads the JWT from cookies/headers and attaches the authenticated user object to req.user.
import cookieParser from "cookie-parser";//Middleware to parse cookies from incoming requests (e.g., JWT stored in req.cookies)

import path from "path";//this is Node’s built-in path module. we use this To safely work with file and folder paths across operating systems (Windows uses \, Linux uses /).
//We use the Node.js path module to work with file and directory paths in a safe and cross-platform way. It helps us generate absolute paths instead of relying on relative paths, which can break depending on where the server is started. For example, when serving static frontend files with Express, I use path.join with __dirname to make sure the file path is always correct on any operating system

import { fileURLToPath } from "url";//fileURLToPath comes from Node’s built-in url module. It converts a file URL(like file:///C:/project/app.js) into a normal file system path (C:\project\app.js).
//In CommonJS (require), you automatically had __filename and __dirname globals.
//In ES Modules, Node doesn’t provide __filename and __dirname. To get them, we use fileURLToPath(import.meta.url) from the url module, which converts the current module’s URL into a usable file system path. This is mainly needed when serving static files or working with absolute paths in an ES Module project.

import fs from "fs";//We import the Node.js fs module to work with the file system of OS. It allows us to read or write files from the backend, for example when serving static frontend files, handling file uploads, or writing logs. In our case, it ensures the backend can directly interact with the filesystem when needed.

//In ES, you don’t have __dirname and __filename. These two lines recreate them so you can safely build absolute paths later (used for serving frontend files).
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();//creating the express application.

app.use(cors({//Enables Cross-Origin Resource Sharing so your frontend (React) can talk to backend (Express).
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000',
        'http://localhost:4173',
        'https://shortify-frontend.onrender.com',
        /\.onrender\.com$/ 
        //The regex /\.onrender\.com$/ allows any subdomain on Render.
    ],
    //In a cross-origin request, browsers block cookies and authorization headers by default. By setting credentials: true in CORS, we allow the frontend to send cookies or other credentials along with requests, which is essential for maintaining authenticated sessions. On the client side, we also need withCredentials: true to actually include the cookies.
    credentials: true
}));

app.use(express.json());//parse incoming JSON payloads
app.use(express.urlencoded({ extended: true }));//parse form data (x-www-form-urlencoded).
app.use(cookieParser());//reads cookies from requests
app.use(attachUser);//custom middleware that attaches the decoded user (from JWT) onto req.user.

//all the api routes.
app.use("/api/user", user_routes);
app.use("/api/auth", auth_routes);
app.use("/api/create", shortUrl);

// Serves all static frontend assets (HTML, CSS, JS) from your React build folder(dist).This is what lets you deploy frontend + backend together on the same server.
//__dirname → current folder where this server file (e.g., app.js) resides.
//"../FRONTEND/dist" → go one folder up, then into the FRONTEND/dist folder.
//path.join → safely constructs the full path for your OS (Windows, Linux, macOS).
//this tells express that if a request comes in for a file (like /index.html, /main.js, /style.css), look for it in the ../FRONTEND/dist folder and serve it directly.
//It is used because it Makes your frontend a part of your backend app.You don’t need a separate web server like Nginx to serve the frontend.
app.use(express.static(path.join(__dirname, "../FRONTEND/dist")));

// Root route — serves frontend if available
//If frontend build exists → serve index.html. If not → fallback JSON message with API info (useful for API-only mode).
app.get("/", (req, res) => {
    const indexPath = path.join(__dirname, "../FRONTEND/dist/index.html");

    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(200).json({
            message: "🔗 Shortify API Server",
            status: "Running",
            note: "Frontend build not found",
            endpoints: {
                health: "/api/health",
                auth: "/api/auth",
                users: "/api/user",
                urls: "/api/create"
            }
        });
    }
});

// Health check
//Simple endpoint for monitoring/uptime checks.
//Used by cloud services to confirm your API is alive.
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Shortify API is running",
        timestamp: new Date().toISOString()
    });
});

// Updated redirection route — allows any slug, not just 6-8 alphanumerics. Redirects user to the original long URL. Attached at / so it catches any slug.
app.use("/", redirect_routes);

// Catch-all(react SPA support): send React app for all non-API routes.
// For unknown routes: If it looks like an API route (/api/...) → return 404 JSON. Otherwise → serve React’s index.html (important for React Router to handle client-side navigation).
app.get("*", (req, res) => {
    if (req.path.startsWith("/api/")) {
        return res.status(404).json({ message: "Route not found" });
    }
    res.sendFile(path.join(__dirname, "../FRONTEND/dist/index.html"));
});

// Error handler. Catches thrown errors from any route and formats them in a consistent JSON response.
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;//Chooses port from .env or defaults to 3000.
app.listen(PORT, () => {
    connectDB();//ensures MongoDB is connected before serving requests.
    console.log(`Server running on http://localhost:${PORT}`);//Logs server URL.
});
