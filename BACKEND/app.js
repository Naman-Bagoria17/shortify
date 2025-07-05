import express from "express";
import dotenv from "dotenv";
dotenv.config("./.env")
import connectDB from "./src/config/mongo.config.js"
import shortUrl from "./src/routes/shortUrl.route.js";
import auth_routes from "./src/routes/auth.routes.js"
import user_routes from "./src/routes/user.routes.js"
import { redirectFromShortUrl } from "./src/controller/shortUrl.controller.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import cors from "cors"
import { attachUser } from "./src/utils/attachUser.js";
import cookieParser from "cookie-parser"
const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
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

// Health check endpoint for Render
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Shortify API is running",
        timestamp: new Date().toISOString()
    });
});

// /:id will do the redirection
app.get("/:id", redirectFromShortUrl);

app.use(errorHandler)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})