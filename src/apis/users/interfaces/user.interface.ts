import { CreateUserDTO } from '../dto/create-user.dto';

export interface IUserCreateDTO {
    createDTO: CreateUserDTO;
}

export interface IUserFindOneUserByID {
    name: CreateUserDTO['name'];
    phone: CreateUserDTO['phone'];
}

export interface IUserUpdateDTO {
    profileImage?: CreateUserDTO['profileImage'];
    nickname?: CreateUserDTO['nickname'];
    interests?: CreateUserDTO['interests'];
}
