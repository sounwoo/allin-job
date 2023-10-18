import { Response } from 'express';
import { url } from './callbackUrl';

export const saveCookie = (res: Response, key: string, value: string) => {
    if (url().origin) {
        // 배포 환경
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        // res.setHeader(
        //     'Set-Cookie',
        //     `refreshToken=${value}; path=/; domain=.allinjob.co.kr; SameSite=None; Secure; httpOnly`,
        // );
        // const domain = 'domain=.allinjob.co.kr;';
        res.cookie('refreshToken', value, {
            domain: 'allinjob.co.kr',
            path: '/',
            sameSite: 'none',
            secure: true,
            httpOnly: true,
        });

    } else {
        // 로컬 환경
        const domain = `${key}=${value}; path=/;`;
        res.setHeader(
            'Set-Cookie',
            `${domain}${key === 'refreshToken' && ' Max-Age=3600'}`,
        );
    }
};
