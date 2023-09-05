import { Competition, Intern, Outside } from '@prisma/client';

interface CommonType {
    Dday: string;
    title: string;
    view: string;
    mainImage: string;
    organization: string;
    enterprise: string;
    homePage: string;
    detail: string;
    target: string;
    applicationPeriod: string;
    preferentialTreatment: string;
}

export interface InternType extends CommonType {
    personnel: string;
    region: string;
}

export interface OutsideType extends InternType {
    participationPeriod: string;
}

export interface CompetitionType extends CommonType {
    Scale: string;
    benefits: string;
}

export type paths = {
    path: 'outside' | 'intern' | 'competition';
};

export type createPaths = 'outside' | 'intern' | 'competition';

export type findCrawiling = Competition[] | Outside[] | Intern[];

export type createCrawiling = Competition | Outside | Intern;
