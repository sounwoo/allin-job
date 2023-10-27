export interface ExamSchedules {
    turn: string;
    wtReceipt: string;
    wtDday: string;
    wtResultDay: string;
    ptReceipt: string;
    ptDday: string;
    resultDay: string;
}

export interface CategortObj {
    mainCategory?: QnetType['mainCategory'];
    subCategory?: QnetType['subCategory'];
}

export interface QnetType {
    id: string;
    detail: string;
    scheduleInfo: string;
    examSchedules: ExamSchedules[];
    title: string;
    enTitle: string;
    relatedDepartment: string;
    institution: string;
    scrap: number;
    view: number;
    mainCategory: string;
    subCategory: string;
    image: string;
}

export interface QnetFindeManyType
    extends Pick<
        QnetType,
        'id' | 'title' | 'relatedDepartment' | 'institution' | 'scrap' | 'view'
    > {
    examSchedules: ExamSchedules[];
}
