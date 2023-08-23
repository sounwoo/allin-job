import { NextFunction, Request, Response, Router } from 'express';
import passport from 'passport';

class AuthController {
    router = Router();
    path = '/login';

    constructor() {
        this.init();
    }

    init() {
        this.router.get('/:social', this.social.bind(this));

        this.router.get(
            '/:social/callback',
            this.socialCallback.bind(this),
        );
    }

    async social(req: Request, res: Response, next: NextFunction) {
        const path = req.params;
        const socialName = path.social;
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

    async socialCallback(req: Request, res: Response) {
        const path = req.params;
        const socialName = path.social;
        passport.authenticate(socialName, {
            failureRedirect: '/', // 실패 리다이렉트 주소
        })(req, res, () => {
            res.redirect(
                '/', // 성공 리다이렉트 주소
            );
        });
    }
}

export default new AuthController();
