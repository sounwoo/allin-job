import { validate } from 'class-validator';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './users.service';
import { Request, Response, Router } from 'express';
import { AuthService } from '../auth/auth.service';
import { SmsService } from '../../common/util/sms.service';

class UserController {
    router = Router();
    path = '/user';

    private userService: UserService;
    private authService: AuthService;
    private smsService: SmsService;
    constructor() {
        this.init();
        this.userService = new UserService();
        this.authService = new AuthService();
        this.smsService = new SmsService();
    }

    init() {
        this.router.get(
            '/findOneUserByEmail',
            this.findOneUserByEmail.bind(this),
        );

        this.router.get(
            '/findOneUserByID',
            this.findOneUserByID.bind(this),
        );

        this.router.post('/createUser', this.createUser.bind(this));

        this.router.post(
            '/sendTokenSMS',
            this.sendTokenSMS.bind(this),
        );

        this.router.post(
            '/validateToken',
            this.validateToken.bind(this),
        );
    }

    async findOneUserByEmail(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        const email: string = req.query.email as string;
        res.status(200).json(
            await this.userService.findOneUserByEmail(email),
        );
    }

    async findOneUserByID(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        const { name, phone }: { name?: string; phone?: string } =
            req.query;

        try {
            if (name && phone) {
                const user = await this.userService.findOneUserByID({
                    name,
                    phone,
                });
                res.status(200).json(user);
            } else {
                throw new Error(
                    '이름과 휴대폰번호가 모두 필요합니다',
                );
            }
        } catch (error) {
            res.status(500).json({ error: '서버문제' });
        }
    }

    async createUser(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        const createDTO = new CreateUserDTO(req.body);
        const errors = await validate(createDTO);

        if (errors.length > 0) {
            const errorMessage = errors.map((error) => {
                const temp =
                    error.constraints &&
                    Object.values(error.constraints);
                return `${error.property} : ${temp}`;
            });
            return res.status(400).json({ error: errorMessage });
        }

        try {
            const user = await this.userService.createUser({
                createDTO,
            });
            res.status(200).json(
                await this.authService.login({ user, req, res }),
            );
        } catch (error) {
            res.status(500).json({ error: '서버문제' });
        }
    }

    async sendTokenSMS(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        const { phone } = req.body;
        try {
            res.status(200).json(
                await this.smsService.sendTokenSMS(phone),
            );
        } catch (error) {
            res.status(500).json({ error: '서버문제' });
        }
    }

    async validateToken(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        const { token, phone } = req.body;
        try {
            res.status(200).json(
                await this.smsService.validateToken(phone, token),
            );
        } catch (error) {
            res.status(500).json({ error: '서버문제' });
        }
    }
}

export default new UserController();
