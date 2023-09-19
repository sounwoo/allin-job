import { NextFunction, Request, Response, Router } from 'express';
import passport from 'passport';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { validateDTO } from '../../common/validator/validateDTO';
import { restoreAccessTokenDTO } from './dto/restoreAccessToken.dto';
import { idType } from '../../common/types';
import AccessGuard from '../../middleware/auth.guard/access.guard';
import { asyncHandler } from '../../middleware/async.handler';
import { Container } from 'typedi';
import RefreshGuard from '../../middleware/auth.guard/refresh.guard';

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

        this.router.post('/', asyncHandler(this.login.bind(this)));

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
                ? 'http://localhost:4000' // 회원가입 되어 있을때 리다이렉트 주소
                : `http://localhost:4000`; // 회원가입 안되어 있을때 리다이렉트 주소

            res.redirect(redirectPath);
        });
    }

    async login(req: Request, res: Response) {
        // #swagger.tags = ['Auth']
        const { id } = req.body as idType;

        await validateDTO(new LoginDTO({ id }));
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

        await validateDTO(new restoreAccessTokenDTO({ id }));
        res.status(200).json({
            data: this.authService.restoreAccessToken({ id }),
        });
    }
}

export default new AuthController(Container.get(AuthService));
