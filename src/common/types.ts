import { CreateUserDTO } from '../apis/users/dto/create-user.dto';

export type email = {
    email: CreateUserDTO['email'];
};

export type idType = {
    id: string;
};

export type findOneUserByIDType = {
    name: CreateUserDTO['name'];
    phone: CreateUserDTO['phone'];
};

export type authorization = {
    authorization: string;
};

export type cookie = {
    cookie: string;
};

export type emailProviderType = {
    email: CreateUserDTO['email'];
    provider: CreateUserDTO['provider'];
};
