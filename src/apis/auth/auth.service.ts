import { Request, Response } from 'express';
import { UserService } from '../users/users.service';
import {
    IAuthGetAccessToken,
    IAuthLogin,
    IAuthRestoreAccessToken,
    IAuthSetRefreshToken,
    IOAuthSocialUser,
} from './interfaces/auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import redis from '../../database/redisConfig';

export class AuthService {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async validateUser(
        req: Request & IOAuthSocialUser,
        res: Response,
    ): Promise<boolean> {
        // const { email, provider } = req.user!;
        const { email } = req!.user!;

        const isUser = await this.userService.findOneUserByEmail(email!);

        if (!isUser) {
            // res.status(200).json({ email, provider });
            return false;
        } else {
            this.setRefreshToken({ id: isUser.id, res });
            return true;
        }
    }

    async login({ id, res }: IAuthLogin): Promise<string> {
        const isUser = await this.userService.isUserByID(id);
        if (!isUser) return 'id가 일치하는 유저가 없습니다';

        this.setRefreshToken({ id, res });

        return this.getAccessToken({ id });
    }

    async logout(req: any): Promise<boolean> {
        const accessToken = req.headers.authorization.replace('Bearer ', '');
        const refreshToken = req.headers.cookie.replace('refreshToken=', '');

        try {
            const accessTokenVerify = jwt.verify(
                accessToken,
                process.env.JWT_ACCESS_KEY!,
            ) as JwtPayload;
            const refreshTokenVerify = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_KEY!,
            ) as JwtPayload;

            const accessTTL =
                accessTokenVerify.exp! - Math.floor(Date.now() / 1000);
            const refreshTTL =
                refreshTokenVerify.exp! - Math.floor(Date.now() / 1000);

            await redis.set(
                `accessToken:${accessToken}`,
                accessToken,
                'EX',
                accessTTL,
            );
            await redis.set(
                `refreshToken:${refreshToken}`,
                refreshToken,
                'EX',
                refreshTTL,
            );

            return true;
        } catch (error) {
            return false;
        }
    }

    getAccessToken({ id }: IAuthGetAccessToken): string {
        return jwt.sign(
            {
                sub: id,
            },
            process.env.JWT_ACCESS_KEY!,
            {
                expiresIn: '1h',
            },
        );
    }

    setRefreshToken({ id, res }: IAuthSetRefreshToken) {
        const refreshToken = jwt.sign(
            {
                sub: id,
            },
            process.env.JWT_REFRESH_KEY!,
            {
                expiresIn: '2w',
            },
        );
        res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);
    }

    restoreAccessToken({ id }: IAuthRestoreAccessToken): string {
        return this.getAccessToken({ id });
    }
}
