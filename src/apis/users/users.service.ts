import { User } from '@prisma/client';
import { CustomPrismaClient } from '../../database/prismaConfig';
import {
    IUserCreateDTO,
    IUserFindOneUserByID,
    IUserUpdateDTO,
} from './interfaces/user.interface';
import RedisClient from '../../database/redisConfig';
import CustomError from '../../common/error/customError';
import { Service } from 'typedi';
import { FindUserKeywordDTO } from './dto/findUserKeyword.dto';
import { ElasitcClient } from '../../database/elasticConfig';
import { SaveInterestKeywordDTO } from './dto/saveInterestKeyword.dto';
import { ScrappingDTO } from './dto/scrapping.dto';
import { scrapData } from '../../common/util/scrap_data';
import { splitDate } from '../../common/util/splitDate';
import { GetUserScrapDTO } from './dto/getUserScrap.dto';
import { ScrapType } from './types/scrap.type';
import { idType } from '../../common/types';
import { languageTitle } from '../../common/util/languageData';

@Service()
export class UserService {
    constructor(
        private readonly prisma: CustomPrismaClient, //
        private readonly redis: RedisClient,
        private readonly elastic: ElasitcClient,
    ) {}

    async findUserKeyword({
        id,
        path,
        classify,
    }: FindUserKeywordDTO): Promise<string> {
        const result = await this.prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                interests: {
                    include: {
                        interest: true,
                        keyword: true,
                    },
                },
            },
        });

        let keywords: string[] = [];

        result!.interests.forEach(
            (el) =>
                el.interest.interest === path &&
                keywords.push(el.keyword.keyword),
        );

        if (classify) {
            keywords = await Promise.all(
                keywords.map(async (test) => {
                    return this.elastic
                        .search({
                            index: path,
                            _source: 'test',
                            size: 1,
                            body: {
                                query: {
                                    bool: {
                                        must: [
                                            { match: { classify } },
                                            { match: { test } },
                                        ],
                                    },
                                },
                            },
                        })
                        .then((data) => {
                            const hits = data.body.hits.hits[0];
                            return hits && hits._source.test;
                        });
                }),
            );
        }

        return keywords.filter((el) => el).join(' ');
    }

    saveInterestKeyword({ prisma, interests, id }: SaveInterestKeywordDTO) {
        return Promise.all(
            interests.map(async (el) => {
                const [interest, keywords] = Object.entries(el)[0];
                const createdInterest = await prisma.interest.upsert({
                    where: { interest },
                    update: {},
                    create: { interest },
                });

                return Promise.all(
                    keywords.map(async (keyword: string) => {
                        const createdKeyword = await prisma.keyword.upsert({
                            where: { keyword },
                            update: {},
                            create: { keyword },
                        });
                        await prisma.userInterest.create({
                            data: {
                                userId: id,
                                interestId: createdInterest.id,
                                keywordId: createdKeyword.id,
                            },
                        });
                    }),
                );
            }),
        );
    }

    findOneUserByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
            include: {
                interests: {
                    include: {
                        interest: true,
                        keyword: true,
                    },
                },
                communities: true,
            },
        });
    }

    async isUserByID(id: string): Promise<User> {
        const isUser = await this.prisma.user.findUnique({
            where: {
                id,
            },
            include: {
                communities: true,
                interests: true,
            },
        });
        if (!isUser) {
            throw new CustomError('id가 일치하는 유저가 없습니다', 400);
        }
        return isUser;
    }

    async isNickname(nickname: string): Promise<boolean> {
        const isNickname = await this.prisma.user.findUnique({
            where: {
                nickname,
            },
        });
        if (isNickname)
            throw new CustomError('이미 사용중인 닉네임입니다', 400);
        else return true;
    }

    findOneUserByID({
        name,
        phone,
    }: IUserFindOneUserByID): Promise<{ email: string; provider: string }[]> {
        return this.prisma.user.findMany({
            where: {
                name,
                phone,
            },
            select: {
                email: true,
                provider: true,
            },
        });
    }

    async createUser({ createDTO }: IUserCreateDTO): Promise<User['id']> {
        const { interests, ...userData } = createDTO;

        await this.isNickname(userData.nickname);

        return await this.prisma.$transaction(async (prisma) => {
            const user = await prisma.user.create({
                data: {
                    ...userData,
                },
            });

            await this.saveInterestKeyword({ prisma, interests, id: user.id });
            this.redis.del(userData.email);
            return user.id;
        });
    }

    async updateProfile({
        id,
        updateDTO,
    }: {
        id: string;
        updateDTO: IUserUpdateDTO;
    }): Promise<User> {
        const { interests, ...data } = updateDTO;

        const chkUser = await this.isUserByID(id);

        data.nickname && (await this.isNickname(data.nickname));

        if (interests) {
            await this.prisma.userInterest.deleteMany({
                where: { userId: id },
            });

            await this.prisma
                .$transaction(async (prisma) => {
                    await this.saveInterestKeyword({
                        prisma,
                        interests,
                        id: chkUser.id,
                    });
                })
                .then(async () => await this.isUserByID(id));
        }

        return await this.prisma.user.update({
            where: { id },
            data,
            include: {
                interests: {
                    include: {
                        interest: true,
                        keyword: true,
                    },
                },
            },
        });
    }

    async scrapping({
        id,
        path,
        scrapId,
    }: idType & ScrappingDTO): Promise<boolean> {
        await this.isUserByID(id);

        const chkScrap = await this.prisma.user.findFirst({
            include: {
                [scrapData(path).column]: {
                    where: {
                        AND: [{ userId: id, [scrapData(path).id]: scrapId }],
                    },
                },
            },
        });

        const chkPlusMinus = chkScrap?.[scrapData(path).column].length;
        const plusMinus = `ctx._source.scrap${chkPlusMinus ? '--' : '++'}`;

        await Promise.all([
            this.elastic
                .update(
                    {
                        index: path,
                        id: scrapId,
                        body: {
                            script: {
                                source: plusMinus,
                            },
                        },
                    },
                    { ignore: [404] },
                )
                .then((el) => el.body.error && el.meta.context),

            this.prisma.user.update({
                where: { id },
                data: {
                    [scrapData(path).column]: chkPlusMinus
                        ? {
                              deleteMany: { [scrapData(path).id]: scrapId },
                          }
                        : { create: { [scrapData(path).id]: scrapId } },
                },
            }),
        ]);

        return chkPlusMinus ? false : true;
    }

    async getUserScrap({
        id,
        ...data
    }: GetUserScrapDTO & { id: string }): Promise<ScrapType> {
        const { path, count, page } = data;
        await this.isUserByID(id);

        const _id = await this.prisma.user
            .findUnique({
                where: { id },
                include: {
                    [scrapData(path).column]: true,
                },
            })
            .then((data) =>
                data![scrapData(path).column].map(
                    (el: any) => el[scrapData(path).id],
                ),
            );

        return await this.elastic
            .search({
                index: path,
                _source_includes: scrapData(path).info,
                body: {
                    query: {
                        terms: {
                            _id,
                        },
                    },
                    ...(page && { size: 4, from: (+page - 1 || 0) * 4 }),
                },
            })
            .then((data) => {
                return count
                    ? data.body.hits.total.value
                    : data.body.hits.hits.length
                    ? data.body.hits.hits.map((el: any) => {
                          let date;
                          if (path === 'language') {
                              const { classify, test, ...data } = el._source;
                              return {
                                  id: el._id,
                                  data,
                                  title: languageTitle(test),
                              };
                          }
                          if (path === 'qnet') {
                              const schedule = el._source.examSchedules[0];
                              date =
                                  splitDate(schedule.wtReceipt) ??
                                  splitDate(schedule.ptReceipt);
                              delete el._source.examSchedules;
                          } else
                              date = splitDate(el._source.date).split('(')[0];
                          return {
                              id: el._id,
                              ...el._source,
                              date,
                          };
                      })
                    : null;
            });
    }
    async delete(email: string): Promise<boolean> {
        const user = await this.findOneUserByEmail(email);

        const qqq = await this.prisma.user.delete({ where: { id: user?.id } });
        console.log(qqq);
        return true;
    }
}
