import {
    createLanguagePaths,
    createLinkareerPaths,
    createPaths,
    findCrawiling,
    paths,
} from '../../common/crawiling/interface';
import { languageData } from '../../common/crawiling/language';
import { linkareerData } from '../../common/crawiling/linkareer';
import { QNetData } from '../../common/crawiling/q-net';
import prisma from '../../database/prismaConfig';

export class CrawilingService {
    async findeCrailing({ ...data }: paths): Promise<findCrawiling> {
        const datas: { [key: string]: string } = { ...data };

        const keywords: object[] = [];
        for (const key in data) {
            const temp = [
                ...datas[key]
                    .split(',')
                    .map((el: string) => ({ [key]: { contains: el } })),
            ];
            keywords.push(...temp);
        }

        const obj = {
            outside: () =>
                prisma.outside.findMany({
                    where: {
                        AND: keywords.length
                            ? keywords.map((el: object) => el)
                            : [],
                    },
                }),
            intern: () =>
                prisma.intern.findMany({
                    where: {
                        AND: keywords.length
                            ? keywords.map((el: object) => el)
                            : [],
                    },
                }),
            competition: () =>
                prisma.competition.findMany({
                    where: {
                        AND: keywords.length
                            ? keywords.map((el: object) => el)
                            : [],
                    },
                }),
            language: () =>
                prisma.language.findMany({
                    where: {
                        OR: data.path.split(',').map((el) => ({ path: el })),
                    },
                }),
            qnet: () =>
                prisma.qNet.findMany({
                    where: {
                        category: {
                            keyword: data.category && data.category,
                        },
                    },
                    include: { examSchedules: true, category: true },
                }),
        };
        return (obj[data.path] || obj['language'])();
    }

    async crawiling(path: createPaths): Promise<boolean> {
        const linkareer = ['outside', 'intern', 'competition'];
        const language = [
            'toeic',
            'toeicBR',
            'toeicSW',
            'toeicWT',
            'toeicST',
            'ch',
            'jp',
            'jpSP',
        ];
        const data = linkareer.includes(path)
            ? await linkareerData(path as createLinkareerPaths)
            : language.includes(path)
            ? await languageData(path as createLanguagePaths)
            : await QNetData();

        return !!data.length;
    }
}
