import { Provider, User } from '@prisma/client';
import prisma from '../../database/prismaConfig';
import {
    IUserCreateDTO,
    IUserFindOneUserByID,
} from './interfaces/user.interface';
import redis from '../../database/redisConfig';

export class UserService {
    findOneUserByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                email,
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
            return '로그인한 이메일과 일치하지 않습니다.';

        if (await this.findOneUserByEmail(userData.email))
            return '이미 존재하는 이메일이 있습니다.';

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
