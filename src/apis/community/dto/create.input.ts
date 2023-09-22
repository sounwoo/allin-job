import { Community } from '@prisma/client';
import { IsString } from 'class-validator';

export class CreateCommunityDTO {
    @IsString()
    path: Community['path'];

    @IsString()
    title: Community['title'];

    @IsString()
    detail: Community['detail'];

    constructor(data: CreateCommunityDTO) {
        this.path = data.path;
        this.title = data.title;
        this.detail = data.detail;
    }
}
