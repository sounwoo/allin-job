export interface LanguageType {
    id: string;
    test: string;
    classify: string;
    mainImage: string;
    homePage: string;
    turn?: string | undefined;
    Dday: string;
    resultDay: string;
    date: string;
    detail: string;
    scrap: number;
}

export interface LanguagefindeManyType extends Omit<LanguageType, 'detail'> {}
