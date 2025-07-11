import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./src/config/mongo.config.js";
import shortUrl from "./src/routes/shortUrl.route.js";
import auth_routes from "./src/routes/auth.routes.js";
import user_routes from "./src/routes/user.routes.js";
import { redirectFromShortUrl } from "./src/controller/shortUrl.controller.js";
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

// Debug routes
app.get("/api/debug/users", async (req, res) => {
    try {
        const User = (await import("./src/models/user.model.js")).default;
        const userCount = await User.countDocuments();
        const users = await User.find({}, { email: 1, name: 1 }).limit(5);
        res.json({ success: true, userCount, sampleUsers: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get("/api/debug/build", (req, res) => {
    const distPath = path.join(__dirname, "../FRONTEND/dist");
    const indexPath = path.join(__dirname, "../FRONTEND/dist/index.html");

    res.json({
        distExists: fs.existsSync(distPath),
        indexExists: fs.existsSync(indexPath),
        distPath,
        indexPath,
        distContents: fs.existsSync(distPath) ? fs.readdirSync(distPath) : "Directory not found"
    });
});

app.get("/api/debug/urls", async (req, res) => {
    try {
        const ShortUrl = (await import("./src/models/shortUrl.model.js")).default;
        const urlCount = await ShortUrl.countDocuments();
        const urls = await ShortUrl.find({}).limit(10);
        res.json({
            success: true,
            urlCount,
            sampleUrls: urls.map(url => ({
                id: url._id,
                short_url: url.short_url,
                full_url: url.full_url,
                clicks: url.clicks
            }))
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ✅ Updated redirection route — allows any slug, not just 6-8 alphanumerics
app.get("/:id", (req, res, next) => {
    // Skip if it's clearly a frontend or API route
    const reserved = ["api", "login", "signup", "dashboard"];
    if (reserved.includes(req.params.id)) return next();
    return redirectFromShortUrl(req, res, next);
});

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
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
