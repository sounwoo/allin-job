import { Response } from 'express';

export const saveCookie = (res: Response, key: string, value: string) => {
    // 배포 환경
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    const domain = `domain=.allinjob.co.kr; SameSite=None;`;
    res.setHeader(
        'Set-Cookie',
        `${key}=${value};path=/; ${domain} ${
            key === 'refreshToken' ? 'Secure; httpOnly' : 'Max-Age=3600'
        }`,
    );

    // 로컬 환경
    // const domain = `${key}=${value}; path=/;`;
    // res.setHeader(
    //     'Set-Cookie',
    //     `${domain}${key === 'refreshToken' && ' Max-Age=3600'}`,
    // );
};
