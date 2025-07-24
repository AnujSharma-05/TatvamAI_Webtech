import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// CORS configuration
app.use((req, res, next) => {
    console.log('Request received:', req.method, req.url);
    console.log('Origin:', req.headers.origin);
    console.log('Headers:', req.headers);
    
    const allowedOrigins = [
        "https://www.tatvamai.in",
        "https://tatvamai.in",
        "https://tatvam-ai.vercel.app", 
        "http://localhost:8080", 
        "https://localhost:8080", 
        "http://localhost:3000", 
        "http://localhost:5173",
        "http://localhost:4173"
    ];
    
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin, Accept, Cache-Control');
    res.setHeader('Access-Control-Allow-Credentials', 'false');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
    
    if (req.method === 'OPTIONS') {
        console.log('Handling OPTIONS request');
        res.status(200).end();
        return;
    }
    
    next();
});

app.use(express.json({limit: '16kb'})); // Limit request body size to 16kb (allowing json requests)
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(cookieParser()); // Parse cookies from request headers

// Import routes
import userRouter from './routes/user.routes.js';
import recordingRouter from './routes/recording.routes.js';
import rewardTokenRouter from './routes/rewardToken.routes.js';
import healthcheckRouter from './routes/healthcheck.routes.js';
import e from 'express';

// Use routes
app.use("/api/v1/healthcheck", healthcheckRouter)

app.use('/api/v1/users', userRouter);

app.use('/api/v1/recordings', recordingRouter);

app.use('/api/v1/reward-tokens', rewardTokenRouter);

// Test endpoint for debugging
app.get('/api/v1/test', (req, res) => {
    res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

export default app;