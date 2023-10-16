export interface examSchedules {
    turn: string;
    wtReceipt: string;
    wtDday: string;
    wtResultDay: string;
    ptReceipt: string;
    ptDday: string;
    resultDay: string;
}

export interface categortObj {
    mainCategory?: QnetType['mainCategory'];
    subCategory?: QnetType['subCategory'];
}

export interface QnetType {
    id: string;
    detail: string;
    scheduleInfo: string;
    examSchedules: examSchedules[];
    title: string;
    enTitle: string;
    relatedDepartment: string;
    institution: string;
    scrap: number;
    view: number;
    mainCategory: string;
    subCategory: string;
}

export interface QnetFindeManyType
    extends Pick<
        QnetType,
        'id' | 'title' | 'relatedDepartment' | 'institution' | 'scrap' | 'view'
    > {}
