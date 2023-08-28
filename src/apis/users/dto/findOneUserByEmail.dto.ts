import { IsEmail } from 'class-validator';

export class FindOneUserByEmailDTO {
    @IsEmail()
    email: string;

    constructor(email: string) {
        this.email = email;
    }
}
