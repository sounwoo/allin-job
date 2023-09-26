import { Language, QNet, SubCategory } from '@prisma/client';
import {
    CompetitionType,
    InternType,
    OutsideType,
    Path,
    createCrawiling,
    createLanguagePaths,
    createLinkareerPaths,
    createPaths,
    createQNet,
    findCrawling,
    findeDetail,
    findeDetailType,
    languagePath,
    paths,
} from '../../common/crawiling/interface';
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
                        examSchedules: {
                            skip: 0,
                            take: 1,
                            orderBy: {
                                resultDay: 'asc',
                            },
                        },
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
                this.prisma.qNet.update({
                    where: { id },
                    data: { view: { increment: 1 } },
                    include: {
                        examSchedules: true,
                    },
                }),
        };

        return (obj[path] || obj['language'])();
    }

    findSubCategory(keyword: string): Promise<SubCategory | null> {
        return this.prisma.subCategory.findUnique({
            where: { keyword },
        });
    }

    async createMainCategory(
        mainKeyword: string,
        subKeyword: string,
    ): Promise<SubCategory> {
        let mainCategory;

        try {
            mainCategory = await this.prisma.mainCategory.create({
                data: {
                    keyword: mainKeyword,
                },
            });
        } catch (error) {
            mainCategory = await this.prisma.mainCategory.findUnique({
                where: { keyword: mainKeyword },
            });
        }

        let subCategory;

        try {
            subCategory = await this.prisma.subCategory.create({
                data: {
                    keyword: subKeyword,
                    mainCategoryId: mainCategory!.id,
                },
            });
        } catch (error) {
            subCategory = await this.findSubCategory(subKeyword);
        }

        return subCategory!;
    }

    createLanguageData({
        path,
        homePage,
        dataObj,
    }: languagePath): Promise<Language> {
        return this.prisma.language.create({
            data: { path, homePage, ...dataObj },
        });
    }

    async createLinkareerData<T extends object>({
        data,
        path,
        month,
    }: {
        data: T;
        path: createLinkareerPaths;
        month: number;
    }): Promise<createCrawiling> {
        const result = {
            outside: async () =>
                await this.prisma.outside.create({
                    data: { ...(data as OutsideType), month },
                }),
            intern: async () =>
                await this.prisma.intern.create({ data: data as InternType }),
            competition: async () =>
                await this.prisma.competition.create({
                    data: {
                        ...(data as CompetitionType),
                        scale: +(data as CompetitionType).scale,
                    },
                }),
        };

        return result[path]();
    }

    async createQNetData({
        data,
        mdobligFldNm: keyword,
    }: createQNet): Promise<QNet> {
        const subCategory = await this.findSubCategory(keyword);

        return await this.prisma.qNet.create({
            data: {
                ...data,
                examSchedules: {
                    createMany: {
                        data: data.examSchedules,
                    },
                },
                subCategoryId: subCategory!.id,
            },
        });
    }

    async bsetData({ path }: Path): Promise<findCrawling> {
        const dataDB = {
            outside: async () =>
                (
                    await this.prisma.outside.findMany({
                        select: {
                            id: true,
                            title: true,
                            view: true,
                            enterprise: true,
                            Dday: true,
                            mainImage: true,
                            applicationPeriod: true,
                        },
                        orderBy: { view: 'asc' },
                    })
                ).slice(0, 12),
            competition: async () =>
                (
                    await this.prisma.competition.findMany({
                        select: {
                            id: true,
                            title: true,
                            view: true,
                            enterprise: true,
                            Dday: true,
                            mainImage: true,
                            applicationPeriod: true,
                        },
                        orderBy: {
                            view: 'desc',
                        },
                    })
                ).slice(0, 12),
            intern: async () =>
                (
                    await this.prisma.intern.findMany({
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
                        orderBy: {
                            view: 'asc',
                        },
                    })
                ).slice(0, 12),
            qnet: async () =>
                (
                    await this.prisma.qNet.findMany({
                        include: {
                            examSchedules: {
                                skip: 0,
                                take: 1,
                                orderBy: {
                                    resultDay: 'asc',
                                },
                            },
                        },
                    })
                ).slice(0, 12),
            community: async () =>
                (
                    await this.prisma.community.findMany({
                        orderBy: {
                            view: 'asc',
                        },
                    })
                ).slice(0, 12),
        };

        return dataDB[path]();
    }
}
