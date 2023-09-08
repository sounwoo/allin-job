import { User } from '@prisma/client';
import { IsString } from 'class-validator';

export class LoginDTO {
    @IsString()
    id: User['id'];

    constructor(data: LoginDTO) {
        this.id = data.id;
    }
}
