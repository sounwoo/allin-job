import { Request, Response } from 'express';
import { UserService } from '../users/users.service';
import {
    IAuthGetAccessToken,
    IAuthLogin,
    IAuthRestoreAccessToken,
    IAuthSetRefreshToken,
    IAuthValidateUser,
} from './interfaces/auth.interface';
import jwt from 'jsonwebtoken';
import redis from '../../database/redisConfig';
import { saveBlackList } from '../../common/validator/saveBlackList';

export class AuthService {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async validateUser({
        email,
        provider,
        res,
    }: IAuthValidateUser): Promise<boolean | object> {
        const isUser = await this.userService.findOneUserByEmail(email!);

        if (!isUser) {
            return { email, provider };
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

    async logout(req: Request): Promise<boolean> {
        const dateNow = Math.floor(Date.now() / 1000);
        const tokens = saveBlackList({ req, dateNow });

        await Promise.all([
            redis.set(
                `accessToken:${tokens.acc().token}`,
                'acc',
                'EX',
                tokens.acc().exp,
            ),
            redis.set(
                `refreshToken:${tokens.ref().token}`,
                'ref',
                'EX',
                tokens.ref().exp,
            ),
        ]);
        return true;
    }

    getAccessToken({ id }: IAuthGetAccessToken): string {
        return jwt.sign({ sub: id }, process.env.JWT_ACCESS_KEY!, {
            expiresIn: '1h',
        });
    }

    setRefreshToken({ id, res }: IAuthSetRefreshToken): void {
        const refreshToken = jwt.sign(
            { sub: id },
            process.env.JWT_REFRESH_KEY!,
            { expiresIn: '2w' },
        );

        // 로컬 환경
        // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);

        // 배포 환경
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader(
            'Set-Cookie',
            `refreshToken=${refreshToken};path=/; domain=.allinjob.co.kr; SameSite=None; Secure; httpOnly`,
        );
    }

    restoreAccessToken({ id }: IAuthRestoreAccessToken): string {
        return this.getAccessToken({ id });
    }
}
