import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const saveBlackList = ({
    req,
    dateNow,
}: {
    req: Request;
    dateNow: number;
}): {
    acc(): { token: string; exp: number };
    ref(): { token: string; exp: number };
} => {
    return {
        acc: () => {
            const token = req.headers.authorization!.replace('Bearer ', '');
            const verify = jwt.verify(
                token,
                process.env.JWT_ACCESS_KEY!,
            ) as JwtPayload;
            return { token, exp: verify.exp! - dateNow };
        },
        ref: () => {
            const token = req.headers.cookie!.replace('refreshToken=', '');
            const verify = jwt.verify(
                token,
                process.env.JWT_REFRESH_KEY!,
            ) as JwtPayload;
            return { token, exp: verify.exp! - dateNow };
        },
    };
};
