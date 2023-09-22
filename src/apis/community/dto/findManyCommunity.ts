import { Community } from '@prisma/client';
import { IsString } from 'class-validator';

export class FindManyCommunityDTO {
    @IsString()
    path: Community['path'];

    constructor(data: FindManyCommunityDTO) {
        this.path = data.path;
    }
}
