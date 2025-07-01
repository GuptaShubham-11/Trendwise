import { Request, Response, NextFunction } from 'express';

type AsyncFunction = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void>;

const asyncHandler = (fx: AsyncFunction) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            await fx(req, res, next);
        } catch (error) {
            const err = error as { statusCode?: number; message?: string };
            res.status(err.statusCode || 500).json({
                success: false,
                message: err.message || 'Internal Server Error',
            });
        }
    };
};

export { asyncHandler };
