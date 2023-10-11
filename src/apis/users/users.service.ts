import {
    Provider,
    User,
    UserInterest,
    PrismaClient,
    Prisma,
} from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
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
import { ScrappingDTO } from './dto/scrapping.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { Path } from '../../common/crawiling/interface';
import { ElasitcClient } from '../../database/elasticConfig';

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
            include: {
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

    saveInterestKeyword(
        prisma: Omit<
            PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
            | '$connect'
            | '$disconnect'
            | '$on'
            | '$transaction'
            | '$use'
            | '$extends'
        >,
        interests: object[],
        id: string,
    ) {
        // await this.prisma.$transaction(async (prisma) => {
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
        // });
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

    async isNickname(id: string, nickname: string): Promise<void> {
        const isNickname = await this.prisma.user.findUnique({
            where: {
                nickname,
            },
        });
        if (isNickname)
            throw new CustomError('이미 존재하는 닉네임입니다', 400);
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

    async createUser({ createDTO, qqq }: IUserCreateDTO): Promise<string> {
        const { interests, ...userData } = createDTO;
        const provider = await this.redis.get(userData.email);

        if (!provider)
            throw new CustomError('로그인한 이메일과 일치하지 않습니다.', 400);

        return await this.prisma.$transaction(async (prisma) => {
            const user = await prisma.user.create({
                data: {
                    ...userData,
                    provider: provider as Provider,
                },
            });

            await this.saveInterestKeyword(prisma, interests, user.id);

            // await Promise.all(
            //     interests.map(async (el) => {
            //         const interest = Object.keys(el)[0];
            //         const keywords = Object.values(el)[0];
            //         const createdInterest = await prisma.interest.upsert({
            //             where: { interest },
            //             update: {},
            //             create: { interest },
            //         });

            //         return Promise.all(
            //             keywords.map(async (keyword) => {
            //                 const createdKeyword = await prisma.keyword.upsert({
            //                     where: { keyword },
            //                     update: {},
            //                     create: { keyword },
            //                 });
            //                 await prisma.userInterest.create({
            //                     data: {
            //                         userId: user.id,
            //                         interestId: createdInterest.id,
            //                         keywordId: createdKeyword.id,
            //                     },
            //                 });
            //             }),
            //         );
            //     }),
            // );
            this.redis.del(userData.email);
            return user.id;
        });
    }

    async scrapping({ id, path, scrapId }: ScrappingDTO): Promise<User> {
        const obj: {
            [key: string]: () => { id: string; column: string };
        } = {
            competition: () => ({
                id: 'competitionId',
                column: 'scrapCompetition',
            }),
            outside: () => ({ id: 'outsideId', column: 'scrapOutside' }),
            language: () => ({ id: 'languageId', column: 'scrapLanguage' }),
            qnet: () => ({ id: 'qNetId', column: 'scrapQNet' }),
            intern: () => ({ id: 'internId', column: 'scrapIntern' }),
        };

        await this.isUserByID(id);

        const chkScrap = await this.prisma.user.findFirst({
            include: {
                [obj[path]().column]: {
                    where: { AND: [{ userId: id, [obj[path]().id]: scrapId }] },
                },
            },
        });

        return this.prisma.user.update({
            where: { id },
            data: {
                [obj[path]().column]: chkScrap?.[obj[path]().column].length
                    ? { deleteMany: { [obj[path]().id]: scrapId } }
                    : { create: { [obj[path]().id]: scrapId } },
            },
            include: {
                [obj[path]().column]: true,
            },
        });
    }

    async getUserScrap({
        id,
        path,
    }: {
        id: string;
        path: string;
    }): Promise<any> {
        // const obj: {
        //     [key: string]: string;
        // } = {
        //     competition: 'scrapCompetition',
        //     outside: 'scrapOutside',
        //     language: 'scrapLanguage',
        //     qnet: 'scrapQNet',
        //     intern: 'scrapIntern',
        // };

        const obj: {
            [key: string]: () => { id: string; column: string };
        } = {
            competition: () => ({
                id: 'competitionId',
                column: 'scrapCompetition',
            }),
            outside: () => ({ id: 'outsideId', column: 'scrapOutside' }),
            language: () => ({ id: 'languageId', column: 'scrapLanguage' }),
            qnet: () => ({ id: 'qNetId', column: 'scrapQNet' }),
            intern: () => ({ id: 'internId', column: 'scrapIntern' }),
        };

        //todo 유저 유무 확인
        await this.isUserByID(id);

        //todo path에 따르는 scrap 아이디 찾기
        const scrapId = await this.prisma.user.findUnique({
            where: { id },
            include: {
                [obj[path]().column]: {
                    where: {
                        userId: id,
                    },
                },
            },
        });

        console.log(scrapId);

        const languageIds = scrapId?.[obj[path]().column].map((scrap) => {
            if ('languageId' in scrap) {
                return scrap.languageId;
            }
            return null; // 또는 원하는 기본값
        });

        const aaa = languageIds?.map((id) => ({ term: { _id: id } }));

        // console.log('*******');
        // console.log(scrapId);
        // console.log('*******');

        // todo elasticSearch에서 해당 id에 맞는 데이터 조회하기

        return this.elastic
            .search({
                index: path,
                _source: [
                    'title',
                    'organization',
                    'Dday',
                    'applicationPeriod',
                    'view',
                ],
                body: {
                    query: {
                        bool: {
                            should: aaa,
                        },
                    },
                },
            })
            .then((el) =>
                el.body.hits.hits.map((el: any) => ({
                    id: el._id,
                    ...el._source,
                })),
            );

        /*
            GET /competition/_search
            {
            "_source": [
                "title",
                "organization",
                "Dday",
                "applicationPeriod",
                "view"
            ],
            "query": {
                "bool": {
                "should": [
                    {
                    "term": {
                        "_id": "D-KeHYsBkic3Wrh8-puY"
                    }
                    },
                    {
                    "term": {
                        "_id": "E-KeHYsBkic3Wrh8_Ztn"
                    }
                    }
                ]
                }
            }
            }
            */
    }

    async updateProfile({
        id,
        updateDTO,
    }: {
        id: string;
        updateDTO: IUserUpdateDTO;
    }): Promise<User> {
        const { interests, ...data } = updateDTO;

        // todo 로그인 유저 검증하기
        const aa = await this.isUserByID(id);

        if (data.nickname && aa.nickname === data.nickname)
            throw new CustomError('이미 존재하는 닉네임입니다', 400);

        // const updatedUserData: { [key: string]: string } = {};

        // todo: nickname 중복확인하기
        data.nickname && (await this.isNickname(id, data.nickname));

        // if (updateDTO.nickname) {
        //     updatedUserData.nickname = updateDTO.nickname;
        // }

        // if (updateDTO.profileImage)
        //     updatedUserData.profileImage = updateDTO.profileImage;

        if (interests) {
            // todo 유저 interest와 keyword 삭제하기
            await this.prisma.userInterest.deleteMany({
                where: { userId: id },
            });

            // todo interest, keyword 저장하기
            return this.prisma
                .$transaction(async (prisma) => {
                    await this.saveInterestKeyword(prisma, interests, aa.id);
                })
                .then(async () => await this.isUserByID(id));
        }

        // todo 유저정보 업데이트 하기
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
}
