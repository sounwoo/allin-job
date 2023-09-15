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
        const { path, page, ..._data } = data;
        const datas: { [key: string]: string } = { ..._data };

        let keywords: object[] = [];
        for (const key in _data) {
            if (key === 'scale') {
                const [start, end] = datas[key].split(',');
                keywords = [
                    ...keywords,
                    {
                        [key]: !end
                            ? { gte: +start }
                            : { gte: +start || 0, lte: +end || 0 },
                    },
                ];
            } else if (key === 'mainCategory') {
                keywords = [
                    ...keywords,
                    ...datas[key].split(',').map((el: string) => ({
                        subCategory: { [key]: { keyword: el } },
                    })),
                ];
            } else if (key === 'subCategory') {
                keywords = [
                    ...keywords,
                    ...datas[key]
                        .split(',')
                        .map((el: string) => ({ [key]: { keyword: el } })),
                ];
            } else {
                keywords = [
                    ...keywords,
                    ...datas[key]
                        .split(',')
                        .map((el: string) => ({ [key]: { contains: el } })),
                ];
            }
        }

        const obj = {
            outside: () =>
                prisma.outside.findMany({
                    where: keywords.length
                        ? {
                              OR: keywords.map((el: object) => el),
                          }
                        : {
                              AND: [],
                          },
                    select: {
                        id: true,
                        title: true,
                        view: true,
                        enterprise: true,
                        Dday: true,
                        mainImage: true,
                        applicationPeriod: true,
                    },
                    skip: (+page - 1) * 12,
                    take: +page * 12,
                }),

            intern: () =>
                prisma.intern.findMany({
                    where: keywords.length
                        ? {
                              OR: keywords.map((el: object) => el),
                          }
                        : {
                              AND: [],
                          },
                    select: {
                        id: true,
                        title: true,
                        view: true,
                        enterprise: true,
                        Dday: true,
                        mainImage: true,
                        applicationPeriod: true,
                        region: true,
                    },
                    skip: (+page - 1) * 12,
                    take: +page * 12,
                }),
            competition: () =>
                prisma.competition.findMany({
                    where: keywords.length
                        ? {
                              OR: keywords.map((el: object) => el),
                          }
                        : {
                              AND: [],
                          },
                    select: {
                        id: true,
                        title: true,
                        view: true,
                        enterprise: true,
                        Dday: true,
                        mainImage: true,
                        applicationPeriod: true,
                    },
                    skip: (+page - 1) * 12,
                    take: +page * 12,
                }),
            language: () =>
                prisma.language.findMany({
                    where: {
                        OR: path.split(',').map((el) => ({ path: el })),
                    },
                    skip: (+page - 1) * 12,
                    take: +page * 12,
                }),
            qnet: () =>
                prisma.qNet.findMany({
                    where: {
                        AND: keywords.length
                            ? keywords.map((el: object) => el)
                            : [],
                    },
                    include: {
                        examSchedules: true,
                        subCategory: {
                            include: {
                                mainCategory: true,
                            },
                        },
                    },
                }),
        };
        return (obj[path] || obj['language'])();
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
