import { Community, User } from '@prisma/client';
import { CompetitionFindeManyType } from '../../types/competition.type';
import { InternFindManyType } from '../../types/intern.type';
import { OutsideFindManyTpye } from '../../types/outside.type';
import { QnetFindeManyType } from '../../types/qnet.type';

export interface CommunityFindManyType
    extends Omit<Community, 'detail' | 'userId'> {
    user: Pick<User, 'id' | 'nickname' | 'profileImage'> | null;
}

export type bestDataType =
    | OutsideFindManyTpye
    | InternFindManyType
    | CompetitionFindeManyType
    | QnetFindeManyType
    | CommunityFindManyType;
