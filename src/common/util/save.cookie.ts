import { Response } from 'express';

export const saveCookie = (res: Response, key: string, value: string) => {
    if (key !== 'refreshToken') {
        // 로컬 환경
        // res.setHeader('Set-Cookie', `${key}=${value}; path=/; Max-Age=${3600}`);

        // 배포 환경
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader(
            'Set-Cookie',
            `${key}=${value};path=/; domain=.allinjob.co.kr; SameSite=None; Max-Age=${3600}`,
        );
    }

    // 로컬 환경
    // res.setHeader('Set-Cookie', `${key}=${value}; path=/`);

    // 배포 환경
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
        'Set-Cookie',
        `${key}=${value};path=/; domain=.allinjob.co.kr; SameSite=None; Secure; httpOnly`,
    );
};
