import express from "express";
import dotenv from "dotenv";
dotenv.config()
import connectDB from "./src/config/mongo.config.js"
import shortUrl from "./src/routes/shortUrl.route.js";
import auth_routes from "./src/routes/auth.routes.js"
import user_routes from "./src/routes/user.routes.js"
import { redirectFromShortUrl } from "./src/controller/shortUrl.controller.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import cors from "cors"
import { attachUser } from "./src/utils/attachUser.js";
import cookieParser from "cookie-parser"
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000',
        'http://localhost:4173',
        'https://shortify-frontend.onrender.com',
        /\.onrender\.com$/
    ],
    credentials: true
}));

app.use(express.json());//this is the body parser bcz of which we can use req.body
// The extended option controls which library is used to parse the query string:
// extended: false → uses the built-in querystring library (can parse simple key-value pairs).
// extended: true → uses the qs library (can parse nested objects, arrays, etc.).
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(attachUser)

app.use("/api/user", user_routes)
app.use("/api/auth", auth_routes)
app.use("/api/create", shortUrl)

// Root route - serve frontend if index.html exists, otherwise show API info
app.get("/", (req, res) => {
    const indexPath = path.join(__dirname, "../FRONTEND/dist/index.html");

    // Check if frontend build exists
    if (require('fs').existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        // Fallback to API info if frontend build doesn't exist
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

// Health check endpoint for Render
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Shortify API is running",
        timestamp: new Date().toISOString()
    });
});

// Debug endpoint to check database connection
app.get("/api/debug/users", async (req, res) => {
    try {
        const User = (await import("./src/models/user.model.js")).default;
        const userCount = await User.countDocuments();
        const users = await User.find({}, { email: 1, name: 1 }).limit(5);
        res.json({
            success: true,
            userCount,
            sampleUsers: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Debug endpoint to check frontend build
app.get("/api/debug/build", (req, res) => {
    const fs = require('fs');
    const distPath = path.join(__dirname, "../FRONTEND/dist");
    const indexPath = path.join(__dirname, "../FRONTEND/dist/index.html");

    res.json({
        distExists: fs.existsSync(distPath),
        indexExists: fs.existsSync(indexPath),
        distPath: distPath,
        indexPath: indexPath,
        distContents: fs.existsSync(distPath) ? fs.readdirSync(distPath) : "Directory not found"
    });
});

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, "../FRONTEND/dist")));

// Debug: Log the paths being used
console.log("Static files path:", path.join(__dirname, "../FRONTEND/dist"));
console.log("Index.html path:", path.join(__dirname, "../FRONTEND/dist/index.html"));

// /:id will do the redirection (but only for short URLs that look like short URLs)
app.get("/:id([a-zA-Z0-9]{6,8})", redirectFromShortUrl);

// Catch all handler: send back React's index.html file for any non-API routes
app.get("*", (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith("/api/")) {
        return res.status(404).json({ message: "Route not found" });
    }
    res.sendFile(path.join(__dirname, "../FRONTEND/dist/index.html"));
});

app.use(errorHandler)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})