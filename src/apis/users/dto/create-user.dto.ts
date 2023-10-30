import { User } from '@prisma/client';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

export interface Interests {
    [key: string]: string[];
}

export class CreateUserDTO {
    @IsEmail()
    email: string;

    @IsString()
    provider: User['provider'];

    @IsString()
    @Length(2, 5)
    @Matches(/^[a-zA-Z가-힣]+$/)
    name: string;

    @Length(2, 10)
    @Matches(/^[a-zA-Z가-힣]+$/)
    nickname: string;

    @IsString()
    @Matches(/^010[0-9]{8}$/)
    phone: string;

    @IsString()
    profileImage: string;

    @IsString()
    major: string;

    interests: Interests[];

    constructor(data: CreateUserDTO) {
        this.email = data.email;
        this.provider = data.provider;
        this.name = data.name;
        this.nickname = data.nickname;
        this.phone = data.phone;
        this.profileImage = data.profileImage;
        this.major = data.major;
        this.interests = data.interests;
    }
}
