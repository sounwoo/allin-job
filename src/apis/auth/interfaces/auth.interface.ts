import { NextFunction, Request, Response } from 'express';
import { CreateUserDTO } from '../../users/dto/create-user.dto';

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

export interface IAuthGetAccessToken {
    id: string;
}

export interface IAuthSetRefreshToken {
    id: string;
    res: IContext['res'];
}

export interface IAuthLogin {
    id: string;
    res: IContext['res'];
}

export interface IAuthRestoreAccessToken {
    id: string;
}
