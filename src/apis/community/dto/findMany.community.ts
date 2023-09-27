import { IsString, NotEquals, ValidateIf } from 'class-validator';
import { Community, User } from '@prisma/client';

export class FindManyCommunityDTO {
    @IsString()
    @ValidateIf((_, value) => value !== undefined)
    path?: Community['path'];

    @IsString()
    @ValidateIf((_, value) => value !== undefined)
    title?: Community['title'];

    @IsString()
    @ValidateIf((_, value) => value !== undefined)
    nickName?: User['nickname'];

    @IsString()
    @ValidateIf((_, value) => value !== undefined)
    content?: string;

    constructor(data: FindManyCommunityDTO) {
        this.path = data.path;
        this.title = data.title;
        this.nickName = data.nickName;
        this.content = data.content;
    }
}
