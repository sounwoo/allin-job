import { IsEmail, IsEnum, IsString, Length, Matches } from 'class-validator';
import { Provider, Interest } from '@prisma/client';

export class CreateUserDTO {
    @IsEmail()
    email: string;

    @IsEnum(Provider)
    provider: Provider;

    @Length(2, 5)
    @Matches(/^[a-zA-Z가-힣]+$/)
    name: string;

    @Length(2, 10)
    @Matches(/^[a-zA-Z가-힣]+$/)
    nickname: string;

    @Matches(/^010[0-9]{8}$/)
    phone: string;

    @IsString()
    profileImage: string;

    @IsString()
    major: string;

    @IsEnum(Interest)
    interest: Interest;

    @IsString({ each: true }) // 각 문자열 따로 검증
    keywords: string[];

    constructor(data: CreateUserDTO) {
        this.email = data.email;
        this.provider = data.provider;
        this.name = data.name;
        this.nickname = data.nickname;
        this.phone = data.phone;
        this.profileImage = data.profileImage;
        this.major = data.major;
        this.interest = data.interest;
        this.keywords = data.keywords;
    }
}
