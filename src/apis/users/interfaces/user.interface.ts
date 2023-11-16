import {
    MainMajor,
    UserCompetition,
    UserIntern,
    UserLanguage,
    UserOutside,
    UserQnet,
} from '@prisma/client';
import { paths } from '../../../common/crawiling/interface';
import { idType } from '../../../common/types';
import { CreateThermometerDTO } from '../dto/create-thermometer.dto';
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
export interface IThermometerUpdate {
    id: idType['id'];
    path: paths['path'];
    createThermometer: CreateThermometerDTO;
    mainMajorId: MainMajor['id'];
    thermometerId?: string | undefined;
}

export interface IThermometerUser {
    userCompetition: UserCompetition[];
    userOutside: UserOutside[];
    userQnet: UserQnet[];
    userIntern: UserIntern[];
    userLanguage: UserLanguage[];
}

export interface ITopPercentage {
    id: idType['id'];
    mainMajorId: MainMajor['id'];
}
