import { Request } from 'express';
import { UserService } from '../users/users.service';
import {
    IAuthGetAccessToken,
    IAuthLogin,
    IAuthRestoreAccessToken,
    IAuthSetRefreshToken,
    IAuthValidateUser,
} from './interfaces/auth.interface';
import jwt from 'jsonwebtoken';
import RedisClient from '../../database/redisConfig';
import { saveBlackList } from '../../common/validator/saveBlackList';
import { emailProviderType } from '../../common/types';
import { saveCookie } from '../../common/util/save.cookie';
import { Service } from 'typedi';

@Service()
export class AuthService {
    constructor(
        private readonly userService: UserService, //
        private readonly redis: RedisClient,
    ) {}

    async validateUser({
        req,
        res,
    }: IAuthValidateUser): Promise<boolean | object> {
        const { email, provider } = req.user as emailProviderType;

        const isUser = await this.userService.findOneUserByEmail(email!);

        if (!isUser) {
            await this.redis.set(email, provider, 'EX', 3600);
            saveCookie(req, res, 'email', email);
            return false;
        } else {
            this.setRefreshToken({ req, id: isUser.id, res });
            return true;
        }
    }

    async login({ req, id, res }: IAuthLogin): Promise<string> {
        await this.userService.isUserByID(id);

        this.setRefreshToken({ req, id, res });

        return this.getAccessToken({ id });
    }

    async logout(req: Request): Promise<boolean> {
        const dateNow = Math.floor(Date.now() / 1000);
        const tokens = saveBlackList({ req, dateNow });

        await Promise.all([
            this.redis.set(
                `accessToken:${tokens.acc().token}`,
                'acc',
                'EX',
                tokens.acc().exp,
            ),
            this.redis.set(
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

    setRefreshToken({ req, id, res }: IAuthSetRefreshToken): void {
        const refreshToken = jwt.sign(
            { sub: id },
            process.env.JWT_REFRESH_KEY!,
            { expiresIn: '2w' },
        );

        saveCookie(req, res, 'refreshToken', refreshToken);
    }

    restoreAccessToken({ id }: IAuthRestoreAccessToken): string {
        return this.getAccessToken({ id });
    }
}
