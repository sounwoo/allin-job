import { Path } from '../crawiling/interface';

export const cludes = (path: Path['path'] | 'language'): string[] => {
    const common = ['title', 'view', 'scrap'];
    const qnetLanExcept = [...common, 'Dday', 'mainImage', 'enterprise'];
    const cludes = {
        ousideOrCompetition: [...qnetLanExcept],
        intern: [
            ...qnetLanExcept,
            'preferentialTreatment',
            'location',
            'period',
        ],
        qnet: [...common, 'relatedDepartment', 'institution', 'examSchedules'],
        language: ['test', 'examDate', 'closeDate', 'homePage'],
    };

    return (
        cludes[path as 'intern' | 'qnet' | 'language'] ||
        cludes['ousideOrCompetition']
    );
};
