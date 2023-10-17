import { Request, Response } from 'express';
import { url } from './callbackUrl';

export const saveCookie = (
    req: Request,
    res: Response,
    key: string,
    value: string,
) => {
    if (url().origin) {
        // 배포 환경

        const originList = [
            'http://localhost:5173',
            'http://localhost:5173/',
            'http://127.0.0.1:5173',
            'https://allinjob.co.kr',
        ];
        const origin = req.headers.origin!;
        if (originList.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        res.setHeader(
            'Access-Control-Allow-Methods', //
            'GET, HEAD, OPTIONS, POST, PUT',
        );
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Access-Control-Allow-Headers, Origin, Accept, Authorization, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
        );

        res.setHeader('Access-Control-Allow-Credentials', 'true');
        const domain = `domain=.allinjob.co.kr;`;
        res.setHeader(
            'Set-Cookie',
            `${key}=${value};path=/; ${domain} ${
                key === 'refreshToken'
                    ? ' SameSite=Lax; httpOnly'
                    : ' SameSite=Lax; Max-Age=3600; httpOnly=false'
            }`,
        );
    } else {
        // 로컬 환경
        const domain = `${key}=${value}; path=/;`;
        res.setHeader(
            'Set-Cookie',
            `${domain}${key === 'refreshToken' && ' Max-Age=3600'}`,
        );
    }
};
