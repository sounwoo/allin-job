import {
    createLanguagePaths,
    createLinkareerPaths,
    createPaths,
    findCrawling,
    findeDetail,
    findeDetailType,
    paths,
} from '../../common/crawiling/interface';
import { languageData } from '../../common/crawiling/language';
import { linkareerData } from '../../common/crawiling/linkareer';
import { QNetData } from '../../common/crawiling/q-net';
import { CustomPrismaClient } from '../../database/prismaConfig';
import { Service } from 'typedi';

@Service()
export class CrawlingService {
    constructor(
        private readonly prisma: CustomPrismaClient, //
    ) {}

    async findeCrawling({ ...data }: paths): Promise<findCrawling> {
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
                this.prisma.outside.findMany({
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
                    ...(page && { skip: (+page - 1) * 12 }),
                    ...(page && { take: +page * 12 }),
                }),

            intern: () =>
                this.prisma.intern.findMany({
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
                    ...(page && { skip: (+page - 1) * 12 }),
                    ...(page && { take: +page * 12 }),
                }),
            competition: () =>
                this.prisma.competition.findMany({
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
                    ...(page && { skip: (+page - 1) * 12 }),
                    ...(page && { take: +page * 12 }),
                }),
            language: () =>
                this.prisma.language.findMany({
                    where: {
                        OR: path.split(',').map((el) => ({ path: el })),
                    },
                    ...(page && { skip: (+page - 1) * 12 }),
                    ...(page && { take: +page * 12 }),
                }),
            qnet: () =>
                this.prisma.qNet.findMany({
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

    async findeDetailCrawling({
        path,
        id,
    }: findeDetailType): Promise<findeDetail | null> {
        const obj = {
            outside: () =>
                this.prisma.outside.update({
                    where: { id },
                    data: { view: { increment: 1 } },
                }),
            intern: () =>
                this.prisma.intern.update({
                    where: { id },
                    data: { view: { increment: 1 } },
                }),
            competition: () =>
                this.prisma.competition.update({
                    where: { id },
                    data: { view: { increment: 1 } },
                }),
            language: () => this.prisma.language.findUnique({ where: { id } }),
            qnet: () =>
                this.prisma.qNet.findUnique({
                    where: { id },
                    include: {
                        examSchedules: true,
                    },
                }),
        };

        return (obj[path] || obj['language'])();
    }

    async crawling(path: createPaths): Promise<boolean> {
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
