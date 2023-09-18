import { Provider, User } from '@prisma/client';
import prisma from '../../database/prismaConfig';
import {
    IUserCreateDTO,
    IUserFindOneUserByID,
} from './interfaces/user.interface';
import redis from '../../database/redisConfig';
import CustomError from '../../common/error/customError';

export class UserService {
    findOneUserByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
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
            },
        });
    }

    async isUserByID(id: string): Promise<boolean> {
        return (await prisma.user.findUnique({
            where: {
                id,
            },
        }))
            ? true
            : false;
    }

    async findOneUserByID({
        name,
        phone,
    }: IUserFindOneUserByID): Promise<{ email: string; provider: string }[]> {
        return await prisma.user.findMany({
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

    async createUser({ createDTO }: IUserCreateDTO): Promise<string> {
        const { interests, ...userData } = createDTO;

        if (!(await redis.get(userData.email)))
            throw new CustomError('로그인한 이메일과 일치하지 않습니다.', 400);

        const create = await prisma.$transaction(async (prisma) => {
            const provider = await redis.get(userData.email);
            const user = await prisma.user.create({
                data: {
                    ...userData,
                    provider: provider as Provider,
                },
            });
            await Promise.all(
                interests.map(async (el) => {
                    const interest = Object.keys(el)[0];
                    const keywords = Object.values(el)[0];
                    const createdInterest = await prisma.interest.upsert({
                        where: { interest },
                        update: {},
                        create: { interest },
                    });

                    return Promise.all(
                        keywords.map(async (keyword) => {
                            const createdKeyword = await prisma.keyword.upsert({
                                where: { keyword },
                                update: {},
                                create: { keyword },
                            });
                            await prisma.userInterest.create({
                                data: {
                                    userId: user.id,
                                    interestId: createdInterest.id,
                                    keywordId: createdKeyword.id,
                                },
                            });
                        }),
                    );
                }),
            );
            await redis.del(userData.email);
            return user.id;
        });
        return create;
    }
}
