import { Path } from '../crawiling/interface';

export const scrapData = (path: Path['path'] | 'language') => {
    const data = {
        competition: {
            id: 'competitionId',
            column: 'scrapCompetition',
            info: [
                'mainImage',
                'title',
                'organization',
                'Dday',
                'date',
                'scrap',
                'view',
            ],
        },
        outside: {
            id: 'outsideId',
            column: 'scrapOutside',
            info: [
                'mainImage',
                'title',
                'organization',
                'Dday',
                'date',
                'scrap',
                'view',
            ],
        },
        language: {
            id: 'languageId',
            column: 'scrapLanguage',
            info: ['mainImage', 'test', 'turn', 'Dday', 'date', 'scrap'],
        },
        qnet: {
            id: 'qNetId',
            column: 'scrapQNet',
            info: [
                'turn',
                'title',
                'institution',
                'examSchedules',
                'view',
                'scrap',
            ],
        },
        intern: {
            id: 'internId',
            column: 'scrapIntern',
            info: [
                'mainImage',
                'title',
                'organization',
                'location',
                'Dday',
                'date',
                'view',
                'scrap',
            ],
        },
    };
    return data[path];
};
