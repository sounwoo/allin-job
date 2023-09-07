import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { authorization } from '../../common/types';
import redis from '../../database/redisConfig';

const AccessGuard = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers as authorization;
    const [tokenFormat, accessToken] = authorization
        ? authorization.split(' ')
        : ['', ''];

    if (tokenFormat !== 'Bearer') {
        res.status(400).send({
            errorMessage: '토큰 형식이 일치하지 않습니다.',
        });
        return;
    }
    try {
        const validate = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY!);

        const blacklist = await redis.get(`accessToken:${accessToken}`);
        if (blacklist === accessToken) {
            return res.status(400).send('이미 로그아웃한 accessToken입니다.');
        }

        req.user = { id: validate.sub as string };

        next();
    } catch (err) {
        console.log(err);
        res.status(500).send({
            errorMessage: '로그인 후 이용 가능한 기능입니다.',
        });
    }
};

export default AccessGuard;
