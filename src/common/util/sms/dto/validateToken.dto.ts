import { IsInt, IsString } from 'class-validator';

export class ValidateTokenDTO {
    @IsInt()
    token: number;

    @IsString()
    phone: string;

    constructor(data: ValidateTokenDTO) {
        this.token = data.token;
        this.phone = data.phone;
    }
}
