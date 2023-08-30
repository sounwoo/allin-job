import { CreateUserDTO } from '../../../../apis/users/dto/create-user.dto';

export class SendTokenSmsDTO {
    phone: CreateUserDTO['phone'];

    constructor(data: Pick<CreateUserDTO, 'phone'>) {
        this.phone = data.phone;
    }
}
