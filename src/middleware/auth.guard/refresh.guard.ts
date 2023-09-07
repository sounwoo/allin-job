import jwt from 'jsonwebtoken';
import { cookie } from '../../common/types';
import { NextFunction, Request, Response } from 'express';
import redis from '../../database/redisConfig';

const refreshGuard = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { cookie } = req.headers as cookie;
    const [tokenFormat, refreshToken] = cookie
        ? cookie
              .replace('=', '= ')
              .split(' ')
              .map((token) => token.replace(';', ''))
        : ['', ''];

    if (tokenFormat !== 'refreshToken=') {
        return res.status(400).send({
            errorMessage: '토큰 형식이 일치하지 않습니다.',
        });
    }
    try {
        const validate = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY!);

        const blacklist = await redis.get(`refreshToken:${refreshToken}`);
        if (blacklist === refreshToken) {
            return res.status(400).send('이미 로그아웃한 refreshToken입니다.');
        }

        req.user = { id: validate.sub as string };
        next();
    } catch (err) {
        console.log(err);
        res.status(401).send({
            errorMessage: '로그인 후 이용 가능한 기능입니다.',
        });
    }
};

export default refreshGuard;
