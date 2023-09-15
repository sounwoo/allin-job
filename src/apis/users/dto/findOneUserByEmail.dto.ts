import { CreateUserDTO } from './create-user.dto';

export class FindOneUserByEmailDTO {
    email: CreateUserDTO['email'];

    constructor(data: Pick<CreateUserDTO, 'email'>) {
        this.email = data.email;
    }
}
