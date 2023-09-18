import { NextFunction, Request, Response } from 'express';

export const asyncHandler = (requestHandler: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await requestHandler(req, res, next);
        } catch (err) {
            next(err);
        }
    };
};
