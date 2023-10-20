import { UserService } from './users.service';
import { Request, Response, Router } from 'express';
import { SmsService } from '../../common/util/sms/sms.service';
import { email, findOneUserByIDType, idType } from '../../common/types';
import { asyncHandler } from '../../middleware/async.handler';
import { Container } from 'typedi';
import AccessGuard from '../../middleware/auth.guard/access.guard';
import Validate from '../../common/validator/validateDTO';

class UserController {
    router = Router();
    path = '/user';

    constructor(
        private readonly userService: UserService,
        private readonly smsService: SmsService,
    ) {
        this.init();
    }

    init() {
        this.router.get(
            '/findOneUserByEmail',
            Validate.findOneUserByEmail,
            asyncHandler(this.findOneUserByEmail.bind(this)),
        );

        this.router.get(
            '/findOneUserByID',
            Validate.findOneUserByID,
            asyncHandler(this.findOneUserByID.bind(this)),
        );

        this.router.get(
            '/isNickname',
            Validate.isNickname,
            asyncHandler(this.isNickName.bind(this)),
        );

        this.router.post(
            '/createUser',
            Validate.createUser,
            asyncHandler(this.createUser.bind(this)),
        );

        this.router.post(
            '/sendTokenSMS',
            Validate.sendTokenSMS,
            asyncHandler(this.sendTokenSMS.bind(this)),
        );

        this.router.post(
            '/validateToken',
            Validate.validateToken,
            asyncHandler(this.validateToken.bind(this)),
        );

        this.router.patch(
            '/updateProfile',
            Validate.updateProfile,
            AccessGuard.handle,
            asyncHandler(this.updateProfile.bind(this)),
        );
    }

    async findOneUserByEmail(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        const { email } = req.query as email;
        res.status(200).json({
            data: await this.userService.findOneUserByEmail(email),
        });
    }

    async findOneUserByID(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        const { name, phone } = req.query as findOneUserByIDType;
        res.status(200).json({
            data: await this.userService.findOneUserByID({
                name,
                phone,
            }),
        });
    }

    async isNickName(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        const { nickname } = req.query as nicknameType;
        res.status(200).json({
            data: await this.userService.isNickname(nickname),
        });
    }

    async createUser(req: Request, res: Response) {
        // #swagger.tags = ['Users']

        res.status(200).json({
            data: await this.userService.createUser({
                createDTO: req.body,
            }),
        });
    }

    async sendTokenSMS(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        const { phone } = req.body;
        res.status(200).json({
            data: await this.smsService.sendTokenSMS(phone),
        });
    }

    async validateToken(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        res.status(200).json({
            data: await this.smsService.validateToken(req.body),
        });
    }

    async isNickName(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        const { nickname } = req.body;
        res.status(200).json({
            data: await this.userService.isNickname(nickname),
        });
    }

    async updateProfile(req: Request, res: Response) {
        // #swagger.tags = ['User']
        const { id } = req.user as idType;

        res.status(200).json({
            data: await this.userService.updateProfile({
                id,
                updateDTO: req.body,
            }),
        });
    }
}

export default new UserController(
    Container.get(UserService),
    Container.get(SmsService),
);
