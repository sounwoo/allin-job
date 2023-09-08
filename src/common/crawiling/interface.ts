import { Competition, Intern, Language, Outside, QNet } from '@prisma/client';

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
}

export type paths = {
    path: 'outside' | 'intern' | 'competition' | 'qnet';
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

export type findCrawiling =
    | Competition[]
    | Outside[]
    | Intern[]
    | Language[]
    | QNet[];

export type createCrawiling = Competition | Outside | Intern;

export type itmeType = {
    jmCd: string;
    jmNm: string;
    engJmNm: string;
    instiNm: string;
    implNm: string;
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
