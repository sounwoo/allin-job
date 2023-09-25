import { IsString } from 'class-validator';
import { CreateCommunityDTO } from './create.input';
import { Community } from '@prisma/client';

export class FindManyCommunityDTO {
    @IsString()
    path: Community['path'];

    constructor(data: FindManyCommunityDTO) {
        this.path = data.path;
    }
}
