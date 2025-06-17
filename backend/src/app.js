import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();


// Middlewares setup
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
}))

app.use(express.json({limit: '16kb'})); // Limit request body size to 16kb (allowing json requests)
app.use(express.urlencoded({ extended: true, limit: '16kb' })); // Parse URL-encoded bodies
app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(cookieParser()); // Parse cookies from request headers

// Import routes