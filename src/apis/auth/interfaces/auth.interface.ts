import { User } from '@prisma/client';
import { Request, Response } from 'express';

export interface IOAuthUser {
    user?: {
        email?: string;
        provider?: string;
    };
}

export interface IContext {
    req: Request & IOAuthUser;
    res: Response;
}

export interface IAuthGetAccessToken {
    user: User;
}

export interface IAuthSetRefreshToken {
    user: User;
    req: IContext['req'];
    res: IContext['res'];
}

export interface IAuthLogin {
    user: User;
    req: IContext['req'];
    res: IContext['res'];
}

export interface IAuthRestoreAccessToken {
    user: User;
}
