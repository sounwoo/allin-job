import { Community } from '@prisma/client';
import { idType } from '../../../common/types';
import { CreateCommunityDTO } from '../dto/create.input';

export interface ICommunityCreate {
    id: idType['id'];
    createCommunity: CreateCommunityDTO;
}
