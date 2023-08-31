import { User } from '@prisma/client';
import prisma from '../../database/prismaConfig';
import { IUserCreateDTO, IUserFindUserID } from './interfaces/user.interface';

export class UserService {
    findOneUserByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    async findOneUserByID({
        name,
        phone,
    }: IUserFindUserID): Promise<{ email: string; provider: string }[]> {
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

    async createUser({ createDTO }: IUserCreateDTO): Promise<User | string> {
        const { keywords, ...userData } = createDTO;

        const isEmail = await this.findOneUserByEmail(userData.email);

        if (isEmail) return '이미 존재하는 이메일이 있습니다.';

        return await prisma.user.create({
            data: {
                ...userData,
                keyword: {
                    create: keywords.map((keyword) => ({
                        keyword: {
                            connectOrCreate: {
                                where: { keyword },
                                create: { keyword },
                            },
                        },
                    })),
                },
            },
            include: {
                keyword: true,
            },
        });
    }
}
