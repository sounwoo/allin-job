import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { cookie } from '../../common/types';

const refreshGuard = (req: Request, res: Response, next: NextFunction) => {
    const { cookie } = req.headers as cookie;

    const [tokenFormat, refreshToken] = cookie
        ? cookie.replace('=', '= ').split(' ')
        : ['', ''];

    if (tokenFormat !== 'refereshToken=') {
        res.status(400).send({
            errorMessage: '토큰 형식이 일치하지 않습니다.',
        });
        return;
    }

    try {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY!);
        next();
    } catch (err) {
        console.log(err);
        res.status(500).send({
            errorMessage: '로그인 후 이용 가능한 기능입니다.',
        });
    }
};

export default refreshGuard;
