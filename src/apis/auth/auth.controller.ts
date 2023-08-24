import { NextFunction, Request, Response, Router } from 'express';
import passport from 'passport';
import { IOAuthUser } from './interfaces/auth.interface';
import { UserService } from '../users/users.service';
import { AuthService } from './auth.service';

class AuthController {
    router = Router();
    path = '/login';

    private authService: AuthService;
    private userService: UserService;
    constructor() {
        this.init();
        this.authService = new AuthService();
        this.userService = new UserService();
    }

    init() {
        this.router.get('/:social', this.social.bind(this));

        this.router.get(
            '/:social/callback',
            this.socialCallback.bind(this),
        );
    }

    async social(req: Request, res: Response, next: NextFunction) {
        const socialName = req.params.social;
        if (socialName === 'kakao') {
            await passport.authenticate('kakao', {
                scope: ['account_email'],
            })(req, res, next);
        } else {
            console.log(socialName);
            await passport.authenticate(socialName, {
                scope: ['profile', 'email'],
            })(req, res, next);
        }
    }

    async socialCallback(
        req: IOAuthUser & Request,
        res: Response,
        next: NextFunction,
    ) {
        const socialName = req.params.social;

        passport.authenticate(socialName, {
            failureRedirect: '/',
        })(
            req,
            res,
            async () => {
                const validateUser =
                    await this.authService.validateUser(req, res);

                const redirectPath = validateUser
                    ? '/' // 회원가입 되어 있을때 리다이렉트 주소
                    : '/'; // 회원가입 안되어 있을때 리다이렉트 주소

                res.redirect(redirectPath);
            },
            next,
        );
    }
}

export default new AuthController();
