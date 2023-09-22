import { IsString } from 'class-validator';
import { idType } from '../../../common/types';
import { Community } from '@prisma/client';

export class ToggleLikeCommunityDTO {
    @IsString()
    userId: idType['id'];

    @IsString()
    communityId: Community['id'];

    constructor(data: ToggleLikeCommunityDTO) {
        this.userId = data.userId;
        this.communityId = data.communityId;
    }
}
