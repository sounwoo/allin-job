import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './users.service';
import { Request, Response, Router } from 'express';
import { SmsService } from '../../common/util/sms/sms.service';
import { SendTokenSmsDTO } from '../../common/util/sms/dto/sendTokenSMS.dto';
import { ValidateTokenDTO } from '../../common/util/sms/dto/validateToken.dto';
import { FindOneUserByEmailDTO } from './dto/findOneUserByEmail.dto';
import { validateDTO } from '../../common/validator/validateDTO';
import { FindOneUserByIdDTO } from './dto/findOneUserByID.dto';
import { email, findOneUserByIDType } from '../../common/types';
import { asyncHandler } from '../../middleware/async.handler';

class UserController {
    router = Router();
    path = '/user';

    private userService: UserService;
    private smsService: SmsService;
    constructor() {
        this.init();
        this.userService = new UserService();
        this.smsService = new SmsService();
    }
    init() {
        this.router.get(
            '/findOneUserByEmail',
            asyncHandler(this.findOneUserByEmail.bind(this)),
        );

        this.router.get(
            '/findOneUserByID',
            asyncHandler(this.findOneUserByID.bind(this)),
        );

        this.router.post(
            '/createUser',
            asyncHandler(this.createUser.bind(this)),
        );

        this.router.post(
            '/sendTokenSMS',
            asyncHandler(this.sendTokenSMS.bind(this)),
        );

        this.router.post(
            '/validateToken',
            asyncHandler(this.validateToken.bind(this)),
        );
    }

    async findOneUserByEmail(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        const { email } = req.query as email;
        await validateDTO(new FindOneUserByEmailDTO({ email }));
        res.status(200).json(await this.userService.findOneUserByEmail(email));
    }

    async findOneUserByID(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        const { name, phone } = req.query as findOneUserByIDType;
        await validateDTO(new FindOneUserByIdDTO({ name, phone }));
        const user = await this.userService.findOneUserByID({
            name,
            phone,
        });
        res.status(200).json(user.length === 0 ? null : user);
    }

    async createUser(req: Request, res: Response) {
        // #swagger.tags = ['Users']

        const createDTO = new CreateUserDTO(req.body);
        await validateDTO(createDTO);

        const user = await this.userService.createUser({
            createDTO,
        });
        res.status(200).json(user);
    }

    async sendTokenSMS(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        const { phone } = req.body;
        await validateDTO(new SendTokenSmsDTO({ phone }));
        res.status(200).json(await this.smsService.sendTokenSMS(phone));
    }

    async validateToken(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        const validateTokenDTO = new ValidateTokenDTO(req.body);
        await validateDTO(validateTokenDTO);

        res.status(200).json(
            await this.smsService.validateToken(validateTokenDTO),
        );
    }
}

export default new UserController();
