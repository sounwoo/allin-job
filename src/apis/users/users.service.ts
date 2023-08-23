import { User } from '@prisma/client';
import prisma from '../../database/prismaConfig';
import { IUserCreateDTO } from './interfaces/user-service.interface';

export class UserService {
    async findUser(email: string): Promise<User | null> {
        const result = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        console.log(result);
        return result;
    }

    createUser({ createDTO }: IUserCreateDTO): Promise<User> {
        return prisma.user.create({
            data: {
                ...createDTO,
            },
        });
    }
}
