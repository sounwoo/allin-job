import { NextFunction, Request, Response } from 'express';

export const asyncHandler = (requestHandler: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await requestHandler(req, res, next);
        } catch (err) {
            console.log(err);
            res.status(500).send({ error: '서버문제' });
            // next(err);
        }
    };
};
