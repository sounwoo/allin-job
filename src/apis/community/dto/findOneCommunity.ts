import { Community } from '@prisma/client';
import { IsString } from 'class-validator';

export class FindOneCommunityDTO {
    @IsString()
    id: Community['id'];

    constructor(data: FindOneCommunityDTO) {
        this.id = data.id;
    }
}
