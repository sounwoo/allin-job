import { validate } from 'class-validator';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './users.service';
import { Request, Response, Router } from 'express';
import { AuthService } from '../auth/auth.service';

class UserController {
    router = Router();
    path = '/user';

    private userService: UserService;
    private authService: AuthService;
    constructor() {
        this.init();
        this.userService = new UserService();
        this.authService = new AuthService();
    }

    init() {
        this.router.get(
            '/findOneUserByEmail',
            this.findOneUserByEmail.bind(this),
        );
        this.router.post('/createUser', this.createUser.bind(this));
    }

    async findOneUserByEmail(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        const email: string = req.body.email;
        res.status(200).json(
            await this.userService.findOneUserByEmail(email),
        );
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
}

export default new UserController();
