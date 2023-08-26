import { User } from '@prisma/client';
import prisma from '../../database/prismaConfig';
import {
    IUserCreateDTO,
    IUserFindUserID,
} from './interfaces/user.interface';

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
    }: IUserFindUserID): Promise<
        { email: string; provider: string }[]
    > {
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

    createUser({ createDTO }: IUserCreateDTO): Promise<User> {
        return prisma.user.create({
            data: {
                ...createDTO,
            },
        });
    }
}
