import { CreateUserDTO } from './create-user.dto';

export class FindOneUserByIdDTO {
    name: CreateUserDTO['name'];
    phone: CreateUserDTO['phone'];

    constructor(data: Pick<CreateUserDTO, 'name' | 'phone'>) {
        this.name = data.name;
        this.phone = data.phone;
    }
}
