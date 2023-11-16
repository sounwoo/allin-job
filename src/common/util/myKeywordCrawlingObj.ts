import { paths } from '../crawiling/interface';

export const myKeywordCrawlingObj = (path: paths['path']): string => {
    const obj = {
        competition: 'interests',
        outside: 'field',
        intern: 'institution',
        qnet: 'mainCategory',
        language: 'test',
    };
    return obj[path];
};
