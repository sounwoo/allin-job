import { IsString, Length, Matches } from 'class-validator';
import { CreateUserDTO } from './create-user.dto';

export class FindOneUserByIdDTO {
    @IsString()
    @Length(2, 5)
    @Matches(/^[a-zA-Z가-힣]+$/)
    name: CreateUserDTO['name'];

    @IsString()
    @Matches(/^010[0-9]{8}$/)
    phone: CreateUserDTO['phone'];

    constructor(data: Pick<CreateUserDTO, 'name' | 'phone'>) {
        this.name = data.name;
        this.phone = data.phone;
    }
}
