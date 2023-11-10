import { Provider, User } from '@prisma/client';
import { CreateUserDTO } from '../apis/users/dto/create-user.dto';
import { Path, paths } from './crawiling/interface';
import { CustomPrismaClient } from '../database/prismaConfig';

export type email = {
    email: CreateUserDTO['email'];
};

export type providerTokenType = {
    provider: string;
    token: string;
};

export type getScrapIdType = {
    prisma: CustomPrismaClient;
    id: User['id'];
    path: paths['path'];
};

export type idType = {
    id: User['id'];
};

export type pathPageCountType = {
    path: Path['path'] | 'language';
    count?: string;
    page?: string;
};

export type phoneType = {
    phone: CreateUserDTO['phone'];
};

export type pathIdtype = {
    path: Path['path'] | 'language';
    scrapId: string;
};

export type pathType = {
    path: string;
};

export type categoryType = {
    category: string;
};

export type classifyType = {
    classify: string;
};

export type findOneUserByIDType = {
    name: CreateUserDTO['name'];
    phone: CreateUserDTO['phone'];
};

export type nicknameType = {
    nickname: CreateUserDTO['nickname'];
};

export type authorization = {
    authorization: string;
};

export type cookie = {
    cookie: string;
};

export type emailProviderType = {
    email: CreateUserDTO['email'];
    provider: Provider;
};
