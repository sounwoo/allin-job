import { IsString } from 'class-validator';

export class LoginDTO {
    @IsString()
    id: string;

    constructor(data: LoginDTO) {
        this.id = data.id;
    }
}
