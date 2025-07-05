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

// Root route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "🔗 Shortify API Server",
        status: "Running",
        endpoints: {
            health: "/api/health",
            auth: "/api/auth",
            users: "/api/user",
            urls: "/api/create"
        }
    });
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

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, "../FRONTEND/dist")));

// /:id will do the redirection (but only for short URLs, not static files)
app.get("/:id", redirectFromShortUrl);

// Catch all handler: send back React's index.html file for any non-API routes
app.get("*", (req, res) => {
    // Don't serve index.html for API routes or short URL redirects
    if (req.path.startsWith("/api/") || req.path.match(/^\/[a-zA-Z0-9]{6,}$/)) {
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