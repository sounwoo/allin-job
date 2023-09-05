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
