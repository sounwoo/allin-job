import { User } from '@prisma/client';
import prisma from '../../database/prismaConfig';
import {
    IUserCreateDTO,
    IUserFindOneUserByID,
} from './interfaces/user.interface';

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
        const { keywords, ...userData } = createDTO;

        const isEmail = await this.findOneUserByEmail(userData.email);

        if (isEmail) return '이미 존재하는 이메일이 있습니다.';

        const create = await prisma.user.create({
            data: {
                ...userData,
                keyword: {
                    connectOrCreate: keywords.map((keyword) => ({
                        where: { keyword },
                        create: { keyword },
                    })),
                },
            },
            include: {
                keyword: true,
            },
        });
        return create.id;
    }
}
