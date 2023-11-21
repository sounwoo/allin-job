import { IsOptional, IsString, ValidateIf } from 'class-validator';
import { Community, User } from '@prisma/client';

export class FindManyCommunityDTO {
    @IsString()
    @IsOptional()
    category?: Community['category'];

    @IsString()
    @IsOptional()
    title?: Community['title'];

    @IsString()
    @IsOptional()
    nickName?: User['nickname'];

    @IsString()
    @IsOptional()
    content?: string;

    @IsString()
    @IsOptional()
    page?: string;

    @IsString()
    @IsOptional()
    count?: string;

    constructor(data: FindManyCommunityDTO) {
        this.category = data.category;
        this.title = data.title;
        this.nickName = data.nickName;
        this.content = data.content;
        this.page = data.page;
        this.count = data.count;
    }
}
