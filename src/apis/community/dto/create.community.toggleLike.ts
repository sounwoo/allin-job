import { IsString } from 'class-validator';
import { Community } from '@prisma/client';

export class ToggleLikeCommunityDTO {
    @IsString()
    communityId: Community['id'];

    constructor(data: ToggleLikeCommunityDTO) {
        this.communityId = data.communityId;
    }
}
