import { IsInt } from 'class-validator';
import { CreateUserDTO } from '../../../../apis/users/dto/create-user.dto';

export class ValidateTokenDTO {
    @IsInt()
    token: number;

    phone: CreateUserDTO['phone'];

    constructor(data: {
        token: number;
        phone: CreateUserDTO['phone'];
    }) {
        this.token = data.token;
        this.phone = data.phone;
    }
}
