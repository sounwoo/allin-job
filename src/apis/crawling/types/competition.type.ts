import { OutsideFindManyTpye } from './outside.type';

export interface CompetitionType {
    id: string;
    date: string;
    benefits: string;
    scale: number;
    view: number;
    scrap: number;
    title: string;
    homePage: string;
    target: string;
    institution: string;
    mainImage: string;
    organization: string;
    Dday: string;
    interests: string;
    detail: string;
}

export interface CompetitionFindeManyType extends OutsideFindManyTpye {}
