import { Response } from 'express';
import { url } from './callbackUrl';

export const saveCookie = (res: Response, key: string, value: string) => {
    if (url().origin) {
        // 배포 환경
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        const domain = `domain=.backendclass.store;`;
        res.setHeader(
            'Set-Cookie',
            `${key}=${value};path=/; ${domain} ${
                key === 'refreshToken'
                    ? ' SameSite=None; Secure; httpOnly'
                    : ' SameSite=None; Secure; Max-Age=3600'
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
