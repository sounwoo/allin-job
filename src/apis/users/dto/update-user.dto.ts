import { IsString, IsOptional, Length, Matches } from 'class-validator';
import { Interests } from './create-user.dto';

export class UpdateUserDTO {
    @IsOptional()
    @IsString()
    profileImage?: string;

    @IsOptional()
    @Length(2, 10)
    @Matches(/^[a-zA-Z가-힣]+$/)
    nickname?: string;

    @IsOptional()
    interests?: Interests[];

    constructor(data: UpdateUserDTO) {
        this.profileImage = data.profileImage;
        this.nickname = data.nickname;
        this.interests = data.interests;
    }
}
