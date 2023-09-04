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
        this.setRefreshToken({ id, res });

        return this.getAccessToken({ id });
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
