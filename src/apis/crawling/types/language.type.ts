export interface LanguageType {
    id: string;
    test: string;
    classify: string;
    mainImage: string;
    homePage: string;
    examDate: Date;
    openDate: Date;
    closeDate: Date;
    scrap: number;
}

export interface LanguagefindeManyType extends Omit<LanguageType, 'detail'> {}
