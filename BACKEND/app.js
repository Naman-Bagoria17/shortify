import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./src/config/mongo.config.js";
import shortUrl from "./src/routes/shortUrl.route.js";
import auth_routes from "./src/routes/auth.routes.js";
import user_routes from "./src/routes/user.routes.js";
import redirect_routes from "./src/routes/redirect.routes.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import cors from "cors";
import { attachUser } from "./src/utils/attachUser.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(attachUser);

app.use("/api/user", user_routes);
app.use("/api/auth", auth_routes);
app.use("/api/create", shortUrl);

// Serve static files from frontend
app.use(express.static(path.join(__dirname, "../FRONTEND/dist")));

// Root route — serves frontend if available
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
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Shortify API is running",
        timestamp: new Date().toISOString()
    });
});

// Updated redirection route — allows any slug, not just 6-8 alphanumerics
app.use("/", redirect_routes);

// Catch-all: send React app for all non-API routes
app.get("*", (req, res) => {
    if (req.path.startsWith("/api/")) {
        return res.status(404).json({ message: "Route not found" });
    }
    res.sendFile(path.join(__dirname, "../FRONTEND/dist/index.html"));
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on http://localhost:${PORT}`);
});
