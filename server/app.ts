import express, { Application } from 'express';
import cors from 'cors';

// Initialize express app
const app: Application = express();

if (!process.env.CLIENT_URL) {
    throw new Error('CLIENT_URL environment variable is not set');
}

// Middleware setup
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true,
    })
);
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Routes
import userRouter from './routes/user.route';
import articleRouter from './routes/article.route';
import commentRouter from './routes/comment.route';
import sitemapRoutes from './routes/sitemap.route';
import robotsRoutes from './routes/robots';

app.use('/api/v1/users', userRouter);
app.use('/api/v1/articles', articleRouter);
app.use('/api/v1/comments', commentRouter);
app.use(sitemapRoutes);
app.use(robotsRoutes);

// Global error handler
app.use(
    (
        err: Error,
        _req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        console.error('❌ Error:', err.message);
        res.status(500).json({ message: err.message || 'Internal Server Error' });
    }
);

export { app };
