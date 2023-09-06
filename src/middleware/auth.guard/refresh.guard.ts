import jwt from 'jsonwebtoken';
import { cookie } from '../../common/types';
import { NextFunction, Request, Response } from 'express';

const refreshGuard = (req: Request, res: Response, next: NextFunction) => {
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
