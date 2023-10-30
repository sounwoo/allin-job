import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { authorization } from '../../common/types';
import RedisClient from '../../database/redisConfig';
import CustomError from '../../common/error/customError';
import Container from 'typedi';
import { asyncHandler } from '../async.handler';

class AccessGuard {
    constructor(
        private readonly redis: RedisClient, //
    ) {
        this.handle = asyncHandler(this.handle.bind(this));
    }

    async handle(req: Request, _: Response, next: NextFunction) {
        const { authorization } = req.headers as authorization;

        if (!authorization)
            throw new CustomError('엑세스 토큰이 존재하지 않습니다.', 401);

        const [tokenFormat, accessToken] =
            authorization && authorization.split(' ');

        if (tokenFormat !== 'Bearer')
            throw new CustomError('토큰 형식이 일치하지 않습니다.', 400);

        const blacklist = await this.redis.get(`accessToken:${accessToken}`);
        if (blacklist)
            throw new CustomError('이미 로그아웃한 accessToken입니다.', 400);

        const validate = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY!);

        req.user = { id: validate.sub as string };

        next();
    }
}

export default new AccessGuard(Container.get(RedisClient));
