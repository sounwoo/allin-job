import { Competition, Intern, Language, Outside, QNet } from '@prisma/client';

interface CommonType {
    Dday: string;
    title: string;
    view: number;
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
    month: number;
    interests: string;
    field: string;
    region: string;
    benefits: string;
    participationPeriod: string;
}

export interface CompetitionType extends CommonType {
    region: string;
    scale: string;
    benefits: string;
    interests: string;
}

export interface createQNet {
    data: {
        detail: string;
        scheduleInfo: string;
        jmNm: string;
        engJmNm: string;
        instiNm: string;
        implNm: string;
        examSchedules: examSchedule[];
    };
    mdobligFldNm: string;
}

export type paths = {
    path: 'outside' | 'intern' | 'competition' | 'qnet';
    enterprise: string;
    preferentialTreatment: string;
    region: string;
    field: string;
    interests: string;
    benefits: string;
    month: string;
    target: string;
    mainCategory: string;
    subCategory: string;
    page: string;
};

export type findeDetailType = {
    path: 'outside' | 'intern' | 'competition' | 'qnet';
    id: string;
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

export type findCrawling =
    | {
          id: string;
          title: string;
          enterprise: string;
          Dday: string;
          mainImage: string;
          applicationPeriod: string;
          view: number;
      }[]
    | Language[]
    | QNet[];

export type findeDetail = Competition | Outside | Intern | Language | QNet;

export type createCrawiling = Competition | Outside | Intern;

export type itmeType = {
    jmCd: string;
    jmNm: string;
    engJmNm: string;
    instiNm: string;
    implNm: string;
    mdobligFldNm: string;
    obligfldnm: string;
    jmcd: string;
    mdobligfldnm: string;
};

export type examSchedule = {
    turn: string;
    wtReceipt: string;
    wtDday: string;
    wtResultDay: string;
    ptReceipt: string;
    ptDday: string;
    resultDay: string;
};
