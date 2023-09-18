import { IsEmail } from 'class-validator';
import { CreateUserDTO } from './create-user.dto';

export class FindOneUserByEmailDTO {
    @IsEmail()
    email: CreateUserDTO['email'];

    constructor(data: Pick<CreateUserDTO, 'email'>) {
        this.email = data.email;
    }
}
