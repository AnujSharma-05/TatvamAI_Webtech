import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();


// Middlewares setup
app.use(cors({
    origin: ["https://tatvam-ai.vercel.app", "http://localhost:8080"],
    credentials: true,
}))

// app.use(cors()); // Enable CORS for all origins

app.use(express.json({limit: '16kb'})); // Limit request body size to 16kb (allowing json requests)
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(cookieParser()); // Parse cookies from request headers

// Import routes
import userRouter from './routes/user.routes.js';
import recordingRouter from './routes/recording.routes.js';
import rewardTokenRouter from './routes/rewardToken.routes.js';
import e from 'express';

// Use routes
app.use('/api/v1/users', userRouter);

app.use('/api/v1/recordings', recordingRouter);

app.use('/api/v1/reward-tokens', rewardTokenRouter);

export default app;