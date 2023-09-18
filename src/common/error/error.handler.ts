import { NextFunction, Request, Response } from 'express';
import CustomError from './customError';

export default function errorHandler(
    error: Error,
    _: Request,
    res: Response,
    __: NextFunction,
) {
    const statusCode = error instanceof CustomError ? error.statusCode : 500;

    if (statusCode !== 500)
        res.status(statusCode).json({ error: error.message });
    else res.status(statusCode).json({ error: '서버문제' });
}
