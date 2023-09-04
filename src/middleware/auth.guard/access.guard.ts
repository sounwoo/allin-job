import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { authorization } from '../../common/types';

const AccessGuard = (req: Request, res: Response, next: NextFunction) => {
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
        jwt.verify(accessToken, process.env.JWT_ACCESS_KEY!);
        next();
    } catch (err) {
        console.log(err);
        res.status(500).send({
            errorMessage: '로그인 후 이용 가능한 기능입니다.',
        });
    }
};

export default AccessGuard;
