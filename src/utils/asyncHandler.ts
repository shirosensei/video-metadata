import { Request, Response, NextFunction } from "express";


// Helper function to wrap async functions in a try/catch block
export const asyncHandler = (fn: (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};