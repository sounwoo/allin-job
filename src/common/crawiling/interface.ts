import { Competition, Intern, Language, Outside } from '@prisma/client';

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

export type createLinkareerPaths = 'outside' | 'intern' | 'competition';
export type createLanguagePaths =
    | 'toeic'
    | 'toeicBR'
    | 'toeicSW'
    | 'toeicWT'
    | 'ch'
    | 'jp'
    | 'jpSP';

export type createPaths = createLinkareerPaths & createLanguagePaths;

export interface languageDetail {
    turn?: string;
    Dday: string;
    resultDay: string;
    applicationPeriod: string;
}

export interface languagePath {
    path: createLanguagePaths;
    homePage: string;
    dataObj: languageDetail;
}

export type findCrawiling = Competition[] | Outside[] | Intern[] | Language[];

export type createCrawiling = Competition | Outside | Intern;
