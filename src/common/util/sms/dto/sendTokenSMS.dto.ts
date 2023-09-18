import { IsString, Matches } from 'class-validator';
import { CreateUserDTO } from '../../../../apis/users/dto/create-user.dto';

export class SendTokenSmsDTO {
    @IsString()
    @Matches(/^010[0-9]{8}$/)
    phone: CreateUserDTO['phone'];

    constructor(data: Pick<CreateUserDTO, 'phone'>) {
        this.phone = data.phone;
    }
}
