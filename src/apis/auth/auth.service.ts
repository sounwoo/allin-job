import { Request, Response } from 'express';
import { UserService } from '../users/users.service';
import {
    IAuthGetAccessToken,
    IAuthLogin,
    IAuthRestoreAccessToken,
    IAuthSetRefreshToken,
    IOAuthUser,
} from './interfaces/auth.interface';
import jwt from 'jsonwebtoken';

export class AuthService {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async validateUser(
        req: Request & IOAuthUser,
        res: Response,
    ): Promise<boolean> {
        // 리팩토링 예정
        // const email = req.user?.email && req.user.email;

        // const { email, provider } = req.user!;
        const { email } = req.user!;

        const isUser = await this.userService.findOneUserByEmail(
            email!,
        );

        if (!isUser) {
            // res.status(200).json({ email, provider });
            return false;
        } else {
            this.setRefreshToken({ user: isUser, req, res });
            return true;
        }
    }

    async login({ user, req, res }: IAuthLogin): Promise<string> {
        this.setRefreshToken({ user, req, res });

        const accessToken = this.getAccessToken({ user });
        return accessToken;
    }

    getAccessToken({ user }: IAuthGetAccessToken): string {
        return jwt.sign(
            {
                sub: user.id,
            },
            process.env.JWT_ACCESS_KEY!,
            {
                expiresIn: '1h',
            },
        );
    }

    setRefreshToken({ user, res }: IAuthSetRefreshToken) {
        const refreshToken = jwt.sign(
            {
                sub: user.id,
            },
            process.env.JWT_REFRESH_KEY!,
            {
                expiresIn: '2w',
            },
        );

        res.setHeader(
            'Set-Cookie',
            `refreshToken=${refreshToken}; path=/;`,
        );
    }

    restoreAccessToken({ user }: IAuthRestoreAccessToken): string {
        return this.getAccessToken({ user });
    }
}
