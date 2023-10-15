import { OutsideFindManyTpye } from './outside.type';

export interface InternType {
    id: string;
    date: string;
    preferentialTreatment: string;
    title: string;
    homePage: string;
    target: string;
    institution: string;
    view: number;
    scrap: number;
    mainImage: string;
    organization: string;
    Dday: string;
    personnel: string;
    location: string;
    detail: string;
}

export interface InternFindManyType extends OutsideFindManyTpye {
    location: InternType['location'];
}
