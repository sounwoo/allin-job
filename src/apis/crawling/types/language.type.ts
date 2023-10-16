export interface LanguageType {
    id: string;
    test: string;
    classify: string;
    homePage: string;
    turn?: string | undefined;
    Dday: string;
    resultDay: string;
    date: string;
    detail: string;
}

export interface LanguagefindeManyType extends Omit<LanguageType, 'detail'> {}
