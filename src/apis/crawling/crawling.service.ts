import { Language, QNet, SubCategory } from '@prisma/client';
import {
    CompetitionType,
    InternType,
    OutsideType,
    Path,
    createCrawiling,
    createLinkareerPaths,
    createQNet,
    findCrawling,
    findeDetail,
    findeDetailType,
    languagePath,
    paths,
} from '../../common/crawiling/interface';
import { CustomPrismaClient } from '../../database/prismaConfig';
import { Service } from 'typedi';
import { UserService } from '../users/users.service';

@Service()
export class CrawlingService {
    constructor(
        private readonly prisma: CustomPrismaClient, //
        private readonly userService: UserService, //
    ) {}

    async findeCrawling({ ...data }: paths): Promise<any> {
        const { path, page, ..._data } = data;
        const datas: { [key: string]: string } = { ..._data };
        const keywords: object[] = [];
        for (const key in _data) {
            const value = datas[key];
            if (key === 'scale') {
                const [start, end] = value.split(',');
                const scaleKeyword = !end
                    ? { gte: +start }
                    : { gte: +start || 0, lte: +end || 0 };

                keywords.push({ [key]: scaleKeyword });
            } else if (key === 'mainCategory') {
                keywords.push(
                    ...value.split(',').map((el: string) => ({
                        subCategory: { [key]: { keyword: el } },
                    })),
                );
            } else if (key === 'subCategory') {
                keywords.push(
                    ...value
                        .split(',')
                        .map((el: string) => ({ [key]: { keyword: el } })),
                );
            } else if (path === 'language') {
                keywords.push(
                    ...value.split(',').map((el: string) => ({ [key]: el })),
                );
            } else {
                keywords.push(
                    ...value
                        .split(',')
                        .map((el: string) => ({ [key]: { contains: el } })),
                );
            }
        }
        const obj = {
            outside: () =>
                this.prisma.outside.findMany({
                    ...(keywords.length && {
                        where: {
                            OR: keywords.map((el: object) => el),
                        },
                    }),
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
                    ...(keywords.length && {
                        where: {
                            OR: keywords.map((el: object) => el),
                        },
                    }),
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
                    ...(keywords.length && {
                        where: {
                            OR: keywords.map((el: object) => el),
                        },
                    }),
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
                    where: data.classify
                        ? {
                              AND: keywords.filter((el: any) => el.classify),
                              OR: keywords.filter((el: any) => !el.classify),
                          }
                        : {
                              OR: keywords.map((el: object) => el),
                          },
                    ...(page && { skip: (+page - 1) * 12 }),
                    ...(page && { take: +page * 12 }),
                }),
            qnet: () =>
                this.prisma.qNet.findMany({
                    ...(keywords.length && {
                        where: {
                            OR: keywords.map((el: object) => el),
                        },
                    }),
                    select: {
                        jmNm: true,
                        engJmNm: true,
                        instiNm: true,
                        implNm: true,
                        view: true,
                        examSchedules: {
                            skip: 0,
                            take: 1,
                            orderBy: {
                                resultDay: 'asc',
                            },
                        },
                    },
                }),
        };
        return (obj[path] || obj['language'])();
    }

    async myKeywordCrawling({ ...data }: paths): Promise<findCrawling> {
        const userKeyword = await this.userService.findUserKeyword({
            ...data,
        });
        const obj = {
            competition: 'interests',
            outside: 'field',
            intern: 'enterprise',
            qnet: 'mainCategory',
            language: 'test',
        };

        const params = {
            ...data,
            [obj[data.path]]: userKeyword,
        };

        return await this.findeCrawling(params);
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

    async createLanguageData({
        classify,
        test,
        homePage,
        dataObj,
    }: languagePath): Promise<Language> {
        return await this.prisma.language.create({
            data: { test, classify, homePage, ...dataObj },
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
            outside: () =>
                this.prisma.outside.findMany({
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
                    take: 12,
                }),
            competition: () =>
                this.prisma.competition.findMany({
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
                    take: 12,
                }),
            intern: () =>
                this.prisma.intern.findMany({
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
                    take: 12,
                }),
            qnet: () =>
                this.prisma.qNet.findMany({
                    select: {
                        jmNm: true,
                        engJmNm: true,
                        instiNm: true,
                        implNm: true,
                        view: true,
                        examSchedules: {
                            skip: 0,
                            take: 1,
                            orderBy: {
                                resultDay: 'asc',
                            },
                        },
                    },
                    take: 12,
                }),
            community: () =>
                this.prisma.community.findMany({
                    orderBy: {
                        view: 'asc',
                    },
                    include: {
                        user: true,
                    },
                    take: 12,
                }),
        };

        return dataDB[path]();
    }
}
