import jwt from 'jsonwebtoken';
import { cookie } from '../../common/types';
import { NextFunction, Request, Response } from 'express';
import RedisClient from '../../database/redisConfig';
import CustomError from '../../common/error/customError';
import Container from 'typedi';
import { asyncHandler } from '../async.handler';

class RefreshGuard {
    constructor(
        private readonly redis: RedisClient, //
    ) {
        this.handle = asyncHandler(this.handle.bind(this));
    }

    async handle(req: Request, _: Response, next: NextFunction) {
        const { cookie } = req.headers as cookie;
        const [tokenFormat, refreshToken] = cookie && cookie.split('=');

        if (tokenFormat !== 'refreshToken')
            throw new CustomError('토큰 형식이 일치하지 않습니다.', 400);

        const blacklist = await this.redis.get(`refreshToken:${refreshToken}`);
        if (blacklist)
            throw new CustomError('이미 로그아웃한 refreshToken입니다.', 400);

        const validate = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY!);
        req.user = { id: validate.sub as string };

        next();
    }
}

export default new RefreshGuard(Container.get(RedisClient));
