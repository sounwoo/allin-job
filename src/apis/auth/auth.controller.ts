import { NextFunction, Request, Response, Router } from 'express';
import passport from 'passport';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { validateDTO } from '../../common/validator/validateDTO';
import { restoreAccessTokenDTO } from './dto/restoreAccessToken.dto';
import { email, emailProviderType, idType } from '../../common/types';
import AccessGuard from '../../middleware/auth.guard/access.guard';
import refreshGuard from '../../middleware/auth.guard/refresh.guard';
import { Provider } from '@prisma/client';

class AuthController {
    router = Router();
    path = '/login';

    private authService: AuthService;
    constructor() {
        this.init();
        this.authService = new AuthService();
    }

    init() {
        this.router.get('/:social/callback', this.socialCallback.bind(this));

        this.router.post('/', this.login.bind(this));

        this.router.post('/logout', AccessGuard, this.logout.bind(this));

        this.router.post(
            '/restoreAccessToken',
            refreshGuard,
            this.restoreAccessToken.bind(this),
        );
    }

    async socialCallback(req: Request, res: Response, next: NextFunction) {
        const { social } = req.params;

        await passport.authenticate(social, {
            scope:
                social === 'kakao'
                    ? ['account_email'] //
                    : ['profile', 'email'],
        })(req, res, async (_: any) => {
            try {
                const { email, provider } = req.user as emailProviderType;
                const validateUser = await this.authService.validateUser({
                    email,
                    res,
                });

                if (!validateUser) res.status(200).json({ email, provider });

                const redirectPath = validateUser
                    ? '/' // 회원가입 되어 있을때 리다이렉트 주소
                    : '/'; // 회원가입 안되어 있을때 리다이렉트 주소

                res.redirect(redirectPath);
            } catch (err) {
                console.log(err);
                // next(err);
            }
        });
    }

    async login(req: Request, res: Response) {
        // #swagger.tags = ['Auth']
        const { id } = req.body as idType;
        const validateResult = await validateDTO(new LoginDTO({ id }));

        if (validateResult)
            return res.status(400).json({ error: validateResult });

        try {
            res.status(200).json(await this.authService.login({ id, res }));
        } catch (error) {
            res.status(500).json({ error: '서버문제' });
        }
    }

    async logout(req: Request, res: Response) {
        try {
            res.status(200).json(await this.authService.logout(req));
        } catch (error) {
            res.status(500).json({ error: '서버문제' });
        }
    }

    async restoreAccessToken(req: Request, res: Response) {
        // #swagger.tags = ['Auth']
        const { id } = req.user as idType;
        const validateResult = await validateDTO(
            new restoreAccessTokenDTO({ id }),
        );

        if (validateResult)
            return res.status(400).json({ error: validateResult });

        try {
            res.status(200).json(this.authService.restoreAccessToken({ id }));
        } catch (error) {
            res.status(500).json({ error: '서버문제' });
        }
    }
}

export default new AuthController();
