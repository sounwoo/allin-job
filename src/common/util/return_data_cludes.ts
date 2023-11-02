import { Path } from '../crawiling/interface';

export const cludes = (path: Path['path'] | 'language'): string[] => {
    const common = ['title', 'view', 'scrap'];
    const qnetExcept = [...common, 'Dday', 'mainImage', 'institution', 'date'];
    const cludes = {
        ousideOrCompetition: qnetExcept,
        intern: [
            'Dday',
            'date',
            'institution',
            'view',
            'mainImage',
            'location',
            'organization',
            'title',
        ],
        qnet: ['title', 'relatedDepartment', 'institution', 'examSchedules'],
        language: ['test', 'examDate', 'closeDate'],
    };

    return (
        cludes[path as 'intern' | 'qnet' | 'language'] ||
        cludes['ousideOrCompetition']
    );
};
