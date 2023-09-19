import { NextFunction, Request, Response } from 'express';
import CustomError from './customError';

export default function errorHandler(
    error: CustomError,
    _: Request,
    res: Response,
    __: NextFunction,
) {
    console.error(error);
    if (error.message === 'jwt malformed') {
        error.message = '로그인 후 이용 가능한 기능입니다.';
        error.statusCode = 401;
    }

    res.status(error.statusCode || 500).json({
        error: error.message || '서버문제',
    });
}
