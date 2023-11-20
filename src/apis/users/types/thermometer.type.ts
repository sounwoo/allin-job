import { Path } from '../../../common/crawiling/interface';

interface PercentageData {
    barType: string;
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
export type ThermometerPath = {
    path: Path['path'] | 'language';
};
