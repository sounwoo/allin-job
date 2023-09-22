import { Community } from '@prisma/client';
import { idType } from '../../../common/types';

export interface ICommunityCreate {
    id: idType['id'];
    createCommunity: {
        path: Community['path'];
        title: Community['title'];
        detail: Community['detail'];
    };
}

export interface ICommunityToggleLike {
    userId: idType['id'];
    communityId: Community['id'];
}
