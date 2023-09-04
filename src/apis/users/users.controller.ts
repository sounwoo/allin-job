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
            this.findOneUserByEmail.bind(this),
        );

        this.router.get('/findOneUserByID', this.findOneUserByID.bind(this));

        this.router.post('/createUser', this.createUser.bind(this));

        this.router.post('/sendTokenSMS', this.sendTokenSMS.bind(this));

        this.router.post('/validateToken', this.validateToken.bind(this));
    }

    async findOneUserByEmail(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        const { email } = req.query as email;

        const findOneUserByEmailDTO = new FindOneUserByEmailDTO({
            email,
        });

        const validateResult = await validateDTO(findOneUserByEmailDTO);
        if (validateResult)
            return res.status(400).json({ error: validateResult });

        try {
            res.status(200).json(
                await this.userService.findOneUserByEmail(email),
            );
        } catch (error) {
            res.status(500).json({ error: '서버문제' });
        }
    }

    async findOneUserByID(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        const { name, phone } = req.query as findOneUserByIDType;

        const findOneUserByIdDTO = new FindOneUserByIdDTO({
            name,
            phone,
        });
        const validateResult = await validateDTO(findOneUserByIdDTO);

        if (validateResult)
            return res.status(400).json({ error: validateResult });

        try {
            const user = await this.userService.findOneUserByID({
                name,
                phone,
            });
            res.status(200).json(user.length === 0 ? null : user);
        } catch (error) {
            res.status(500).json({ error: '서버문제' });
        }
    }

    async createUser(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        const createDTO = new CreateUserDTO(req.body);

        const validateResult = await validateDTO(createDTO);
        if (validateResult)
            return res.status(400).json({ error: validateResult });

        try {
            const user = await this.userService.createUser({
                createDTO,
            });
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: '서버문제' });
        }
    }

    async sendTokenSMS(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        const { phone } = req.body;

        const sendTokenSmsDTO = new SendTokenSmsDTO(req.body);
        const validateResult = await validateDTO(sendTokenSmsDTO);
        if (validateResult)
            return res.status(400).json({ error: validateResult });

        try {
            res.status(200).json(await this.smsService.sendTokenSMS(phone));
        } catch (error) {
            res.status(500).json({ error: '서버문제' });
        }
    }

    async validateToken(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        const validateTokenDTO = new ValidateTokenDTO(req.body);
        const validateResult = await validateDTO(validateTokenDTO);
        if (validateResult)
            return res.status(400).json({ error: validateResult });

        try {
            res.status(200).json(
                await this.smsService.validateToken(validateTokenDTO),
            );
        } catch (error) {
            res.status(500).json({ error: '서버문제' });
        }
    }
}

export default new UserController();
