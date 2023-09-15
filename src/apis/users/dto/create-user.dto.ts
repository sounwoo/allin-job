import { IsEmail, IsEnum, IsString, Length, Matches } from 'class-validator';
import { Provider } from '@prisma/client';

export interface Interests {
    [key: string]: string[];
}

export class CreateUserDTO {
    @IsEmail()
    email: string;

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

    interests: Interests[];

    constructor(data: CreateUserDTO) {
        this.email = data.email;
        this.name = data.name;
        this.nickname = data.nickname;
        this.phone = data.phone;
        this.profileImage = data.profileImage;
        this.major = data.major;
        this.interests = data.interests;
    }
}
