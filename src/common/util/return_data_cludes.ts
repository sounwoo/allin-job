import { Path } from '../crawiling/interface';

export const cludes = (path: Path['path'] | 'language'): string[] => {
    const common = ['title', 'view', 'scrap'];
    const qnetExcept = [...common, 'Dday', 'mainImage', 'institution', 'date'];
    const cludes = {
        ousideOrCompetition: qnetExcept,
        intern: [...qnetExcept, 'location', 'organization'],
        qnet: [...common, 'relatedDepartment', 'institution', 'examSchedules'],
        language: ['test', 'Dday', 'date', 'homePage'],
    };

    return cludes[path as 'intern' | 'qnet'] || cludes['ousideOrCompetition'];
};
