export interface OutsideType {
    id: string;
    date: string;
    benefits: string;
    participationPeriod: string;
    preferentialTreatment: string;
    title: string;
    homePage: string;
    target: string;
    institution: string;
    view: number;
    scrap: number;
    month: number;
    mainImage: string;
    field: string;
    organization: string;
    Dday: string;
    personnel: string;
    location: string;
    interests: string;
    detail: string;
}

export interface OutsideFindManyTpye
    extends Pick<
        OutsideType,
        | 'id'
        | 'Dday'
        | 'title'
        | 'view'
        | 'scrap'
        | 'mainImage'
        | 'institution'
        | 'date'
    > {}
