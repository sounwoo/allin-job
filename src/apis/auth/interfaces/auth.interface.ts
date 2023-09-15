import { NextFunction, Request, Response } from 'express';
import { CreateUserDTO } from '../../users/dto/create-user.dto';
import { UserID, UserIdAndContext } from '../../../common/interface';

export interface IOAuthSocialUser {
    user?: {
        email?: CreateUserDTO['email'];
        provider?: CreateUserDTO['provider'];
    };
}

export interface IContext {
    req: Request;
    res: Response;
    next: NextFunction;
}

export interface IAuthGetAccessToken extends UserID {}

export interface IAuthRestoreAccessToken extends UserID {}

export interface IAuthSetRefreshToken extends UserIdAndContext {}

export interface IAuthLogin extends UserIdAndContext {}

export interface IAuthValidateUser {
    email: CreateUserDTO['email'];
    res: Response;
}
