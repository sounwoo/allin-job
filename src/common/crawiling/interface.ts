import {
    QnetType,
    categortObj,
    examSchedules,
} from '../../apis/crawling/types/qnet.type';
import { LanguageType } from '../../apis/crawling/types/language.type';

export interface createQNet {
    data: {
        detail: QnetType['detail'];
        scheduleInfo: QnetType['scheduleInfo'];
        title: QnetType['title'];
        enTitle: QnetType['enTitle'];
        relatedDepartment: QnetType['relatedDepartment'];
        institution: QnetType['institution'];
        scrap: QnetType['scrap'];
        view: QnetType['view'];
        examSchedules: examSchedules[];
    };
    categoryObj: categortObj;
}

export type Path = {
    path: 'outside' | 'intern' | 'competition' | 'qnet';
};

export type paths = {
    path: Path['path'] | 'language';
    institution: string;
    preferentialTreatment: string;
    location: string;
    field: string;
    interests: string;
    benefits: string;
    month: string;
    target: string;
    mainCategory: string;
    subCategory: string;
    page: string;
    classify: string;
    count: string;
};

export type fidneCrawlingType = paths & { count: string };

export type findeDetailType = {
    path: Path['path'];
    id: string;
};

export type createLinkareerPaths = 'outside' | 'intern' | 'competition';
export type createLanguagePaths = 'language';
export type testType =
    | 'toeic'
    | 'toeicBR'
    | 'toeicSW'
    | 'toeicWT'
    | 'ch'
    | 'jp'
    | 'jpSP';

export type createPaths = {
    path: createLinkareerPaths & createLanguagePaths;
    test: testType;
};

export interface languagePath
    extends Pick<LanguageType, 'test' | 'classify' | 'homePage'> {
    dataObj: Pick<LanguageType, 'turn' | 'Dday' | 'resultDay' | 'date'>;
}

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
