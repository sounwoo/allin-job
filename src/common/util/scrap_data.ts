import { Path } from '../crawiling/interface';

export const scrapData = (path: Path['path'] | 'language') => {
    const common = [
        'Dday',
        'mainImage',
        'title',
        'enterprise',
        'scrap',
        'view',
    ];
    const viewScrap = ['view', 'scrap'];

    const data = {
        competition: {
            id: 'competitionId',
            column: 'scrapCompetition',
            info: [...common],
        },
        outside: {
            id: 'outsideId',
            column: 'scrapOutside',
            info: [...common],
        },
        language: {
            id: 'languageId',
            column: 'scrapLanguage',
            info: [
                'Dday',
                'mainImage',
                'test',
                'examDate',
                'closeDate',
                ...viewScrap,
            ],
        },
        qnet: {
            id: 'qNetId',
            column: 'scrapQNet',
            info: ['title', 'institution', 'examSchedules', ...viewScrap],
        },
        intern: {
            id: 'internId',
            column: 'scrapIntern',
            info: [...common, 'location'],
        },
    };
    return data[path];
};
