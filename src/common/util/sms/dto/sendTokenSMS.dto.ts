import { IsString } from 'class-validator';

export class SendTokenSmsDTO {
    @IsString()
    phone: string;

    constructor(data: SendTokenSmsDTO) {
        this.phone = data.phone;
    }
}
