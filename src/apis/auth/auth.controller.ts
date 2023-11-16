import { Request, Response, Router } from 'express';
import passport from 'passport';
import { AuthService } from './auth.service';
import { idType, providerTokenType } from '../../common/types';
import AccessGuard from '../../middleware/auth.guard/access.guard';
import { asyncHandler } from '../../middleware/async.handler';
import { Container } from 'typedi';
import RefreshGuard from '../../middleware/auth.guard/refresh.guard';
import Validate from '../../common/validator/validateDTO';

class AuthController {
    router = Router();
    path = '/login';

    constructor(
        private readonly authService: AuthService, //
    ) {
        this.init();
    }

    init() {
        this.router.get(
            '/:social/callback',
            asyncHandler(this.socialCallback.bind(this)),
        );

        this.router.post(
            '/',
            Validate.login,
            asyncHandler(this.login.bind(this)),
        );

        this.router.post(
            '/logout',
            AccessGuard.handle,
            asyncHandler(this.logout.bind(this)),
        );

        this.router.post(
            '/restoreAccessToken',
            RefreshGuard.handle,
            asyncHandler(this.restoreAccessToken.bind(this)),
        );

        this.router.post(
            '/socialLogin',
            Validate.socialLogin,
            asyncHandler(this.socialLogin.bind(this)),
        );
    }

    async socialLogin(req: Request, res: Response) {
        const { provider, token } = req.body as providerTokenType;

        res.status(200).json({
            data: await this.authService.socialLogin({ provider, token, res }),
        });
    }

    async socialCallback(req: Request, res: Response) {
        const { social } = req.params;

        await passport.authenticate(social, {
            scope:
                social === 'kakao'
                    ? ['account_email'] //
                    : ['profile', 'email'],
        })(req, res, async (_: any) => {
            const validateUser = await this.authService.validateUser({
                req,
                res,
            });

            const redirectPath = validateUser
                ? 'http://localhost:5173' // 회원가입 되어 있을때 리다이렉트 주소
                : 'http://localhost:5173/signup/info'; // 회원가입 안되어 있을때 리다이렉트 주소

            res.redirect(redirectPath);
        });
    }

    async login(req: Request, res: Response) {
        // #swagger.tags = ['Auth']
        const { id } = req.body as idType;

        res.status(200).json({
            data: await this.authService.login({ id, res }),
        });
    }

    async logout(req: Request, res: Response) {
        res.status(200).json({ data: await this.authService.logout(req) });
    }

    async restoreAccessToken(req: Request, res: Response) {
        // #swagger.tags = ['Auth']
        const { id } = req.user as idType;

        res.status(200).json({
            data: this.authService.restoreAccessToken({ id }),
        });
    }
}

export default new AuthController(Container.get(AuthService));
