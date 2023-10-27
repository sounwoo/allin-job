import { IsString } from 'class-validator';

export class SocialLoginDTO {
    @IsString()
    provider: string;

    @IsString()
    token: string;

    constructor(data: SocialLoginDTO) {
        this.provider = data.provider;
        this.token = data.token;
    }
}
