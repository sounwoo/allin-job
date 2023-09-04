import { NextFunction, Request, Response, Router } from 'express';
import passport from 'passport';
import { IOAuthUser } from './interfaces/auth.interface';
import { AuthService } from './auth.service';
import refreshGuard from '../../middleware/auth.guard/refresh.guard';
import { LoginDTO } from './dto/login.dto';
import { validateDTO } from '../../common/validator/validateDTO';
import { restoreAccessTokenDTO } from './dto/restoreAccessToken.dto';

class AuthController {
    router = Router();
    path = '/login';

    private authService: AuthService;
    constructor() {
        this.init();
        this.authService = new AuthService();
    }

    init() {
        this.router.get('/:social', this.social.bind(this));

        this.router.get('/:social/callback', this.socialCallback.bind(this));

        this.router.post('/', this.login.bind(this));

        this.router.post(
            '/restoreAccessToken',
            refreshGuard,
            this.restoreAccessToken.bind(this),
        );
    }

    async social(req: Request, res: Response, next: NextFunction) {
        const { social } = req.params;
        await passport.authenticate(social, {
            scope:
                social === 'kakao'
                    ? ['account_email'] //
                    : ['profile', 'email'],
        })(req, res, next);
    }

    async socialCallback(
        req: IOAuthUser & Request,
        res: Response,
        next: NextFunction,
    ) {
        const { social } = req.params;

        passport.authenticate(social, {
            failureRedirect: '/',
        })(
            req,
            res,
            async () => {
                const validateUser = await this.authService.validateUser(
                    req,
                    res,
                );

                const redirectPath = validateUser
                    ? '/' // 회원가입 되어 있을때 리다이렉트 주소
                    : '/'; // 회원가입 안되어 있을때 리다이렉트 주소

                res.redirect(redirectPath);
            },
            next,
        );
    }

    async login(req: Request, res: Response) {
        // #swagger.tags = ['Auth']
        const { id } = req.body;
        const validateResult = await validateDTO(new LoginDTO({ id }));

        if (validateResult)
            return res.status(400).json({ error: validateResult });

        try {
            res.status(200).json(await this.authService.login({ id, res }));
        } catch (error) {
            res.status(500).json({ error: '서버문제' });
        }
    }

    async restoreAccessToken(req: Request, res: Response) {
        // #swagger.tags = ['Auth']
        const { id } = req.body.id;
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
