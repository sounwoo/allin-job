import { IsEmail } from 'class-validator';
import { User } from '@prisma/client';

export class FindOneUserByEmailDTO {
    @IsEmail()
    email: User['email'];

    constructor(data: FindOneUserByEmailDTO) {
        this.email = data.email;
    }
}
