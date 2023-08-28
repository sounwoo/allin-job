import { IsEmail, IsString } from 'class-validator';

export class CreateUserDTO {
    @IsEmail()
    email: string;

    @IsString()
    provider: string;

    @IsString()
    name: string;

    @IsString()
    nickname: string;

    @IsString()
    phone: string;

    @IsString()
    profileImage: string;

    @IsString()
    major: string;

    @IsString()
    interest: string;

    @IsString()
    keyword: string;

    constructor(data: CreateUserDTO) {
        this.email = data.email;
        this.provider = data.provider;
        this.name = data.name;
        this.nickname = data.nickname;
        this.phone = data.phone;
        this.profileImage = data.profileImage;
        this.major = data.major;
        this.interest = data.interest;
        this.keyword = data.keyword;
    }
}
