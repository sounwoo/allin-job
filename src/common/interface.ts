import { User } from '@prisma/client';
import { IContext } from '../apis/auth/interfaces/auth.interface';

export interface UserID {
    id: User['id'];
}

export interface UserIdAndContext extends UserID {
    res: IContext['res'];
}
