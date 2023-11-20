import {
    Community,
    Keyword,
    MainMajor,
    Prisma,
    PrismaClient,
    User,
    UserCompetition,
    UserIntern,
    UserLanguage,
    UserOutside,
    UserQnet,
} from '@prisma/client';
import { Path } from '../../../common/crawiling/interface';
import { idType } from '../../../common/types';
import { CreateThermometerDTO } from '../dto/create-thermometer.dto';
import { CreateUserDTO, Interests } from '../dto/create-user.dto';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { ScrappingDTO } from '../dto/scrapping.dto';
import { GetUserScrapDTO } from '../dto/getUserScrap.dto';

export interface IUserCreateDTO {
    createDTO: CreateUserDTO;
}

export interface IFindUserKeyword {
    id: User['id'];
    path: paths['path'];
    classify: string;
}

export interface IUserFindOneUserByID {
    name: CreateUserDTO['name'];
    phone: CreateUserDTO['phone'];
}

export interface IUpdateProfile {
    id: User['id'];
    updateDTO: IUserUpdateDTO;
}

export interface IUserUpdateDTO {
    profileImage?: CreateUserDTO['profileImage'];
    nickname?: CreateUserDTO['nickname'];
    interests?: CreateUserDTO['interests'];
}

export interface IScrapping {
    id: User['id'];
    scrappingDTO: ScrappingDTO;
}

export interface IGetUserScrap {
    id: User['id'];
    getUserScrapDTO: GetUserScrapDTO;
}

export interface ISaveInterestKeyword {
    prisma: Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        | '$connect'
        | '$disconnect'
        | '$on'
        | '$transaction'
        | '$use'
        | '$extends'
    >;
    interests: Interests[];

    id: User['id'];
}

export interface IThermometerUpdate {
    id: idType['id'];
    path: Path['path'] | 'language';
    createThermometer: {
        category: Community['category'];
        keyword: Keyword['keyword'];
        activeTitle: UserIntern['activeTitle'];
        activeContent: UserIntern['activeContent'];
        period?: UserIntern['period'];
        score?: UserLanguage['score'];
    };
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

export interface IThermometerFindPath {
    id: idType['id'];
    path: Path['path'] | 'language';
}
