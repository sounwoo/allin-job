import { NextFunction, Request, Response } from 'express';

export interface IOAuthSocialUser {
    user?: {
        email?: string;
        provider?: string;
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
