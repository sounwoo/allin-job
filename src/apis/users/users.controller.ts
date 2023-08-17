import { validate } from 'class-validator';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './users.service';
import { Request, Response, Router } from 'express';

class UserController {
    router = Router();
    path = '/user';

    private userService: UserService;
    constructor() {
        this.init();
        this.userService = new UserService();
    }

    init() {
        this.router.get('/findUser', this.findUser.bind(this));
        this.router.post('/createUser', this.createUser.bind(this));
    }

    // 유저 찾기 API
    async findUser(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        const email: string = req.body.email;
        res.status(200).json(await this.userService.findUser(email));
    }

    // 회원가입 API
    async createUser(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        const createDTO = new CreateUserDTO(req.body);
        const errors = await validate(createDTO);
        // console.log(errors);
        // 유효성 검사 에러 체크
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

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: '서버문제' });
        }
    }
}

export default new UserController();
