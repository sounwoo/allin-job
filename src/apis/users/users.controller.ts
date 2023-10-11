import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './users.service';
import { Request, Response, Router } from 'express';
import { SmsService } from '../../common/util/sms/sms.service';
import { SendTokenSmsDTO } from '../../common/util/sms/dto/sendTokenSMS.dto';
import { ValidateTokenDTO } from '../../common/util/sms/dto/validateToken.dto';
import { FindOneUserByEmailDTO } from './dto/findOneUserByEmail.dto';
import { validateDTO } from '../../common/validator/validateDTO';
import { FindOneUserByIdDTO } from './dto/findOneUserByID.dto';
import {
    email,
    findOneUserByIDType,
    idType,
    pathIdtype,
} from '../../common/types';
import { asyncHandler } from '../../middleware/async.handler';
import { Container } from 'typedi';
import AccessGuard from '../../middleware/auth.guard/access.guard';
import { UpdateUserDTO } from './dto/update-user.dto';
import Validate from '../../common/validator/validateDTO';
import { Path } from '../../common/crawiling/interface';

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
        this.router.post(
            '/scrapping',
            AccessGuard.handle,
            asyncHandler(this.scrapping.bind(this)),
        );

        this.router.patch(
            '/updateProfile',
            Validate.updateProfile,
            AccessGuard.handle,
            asyncHandler(this.updateProfile.bind(this)),
        );

        this.router.get(
            '/getUserScrap/:path',
            AccessGuard.handle,
            asyncHandler(this.getUserScrap.bind(this)),
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

    async scrapping(req: Request, res: Response) {
        // #swagger.tags = ['User']
        const { id } = req.user as idType;
        const { path, scrapId } = req.query as pathIdtype;

        res.status(200).json({
            data: await this.userService.scrapping({ id, path, scrapId }),
        });
    }

    async getUserScrap(req: Request, res: Response) {
        const { id } = req.user as idType;
        const { path } = req.params as Path;
        res.status(200).json({
            data: await this.userService.getUserScrap({ id, path }),
        });
    }

    //todo 프로필 업데이트 하기
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
