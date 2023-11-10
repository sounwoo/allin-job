interface PercentageData {
    barType: string; // 여기에 실제 타입을 지정하십시오.
    percent: number;
}

export interface PercentageType {
    competition: PercentageData;
    outside: PercentageData;
    qnet: PercentageData;
    language: PercentageData;
    intern: PercentageData;
    sum: number;
}
