import { Service } from 'typedi';
import { UserService } from '../users/users.service';
import CustomError from '../../common/error/customError';
import { Community } from '@prisma/client';
import { CustomPrismaClient } from '../../database/prismaConfig';
import { ICommunityCreate } from './interfaces/community.interface';

@Service()
export class CommunityService {
    constructor(
        private readonly prisma: CustomPrismaClient, //

        private readonly userService: UserService, //
    ) {}

    async create({
        id,
        createCommunity,
    }: ICommunityCreate): Promise<Community> {
        const isUser = await this.userService.isUserByID(id);
        if (!isUser) throw new CustomError('존재하지 않는 아이디입니다.', 400);
        return this.prisma.community.create({
            data: { userId: isUser.id, ...createCommunity },
        });
    }

    findeMany({ path }: { path: string | undefined }): Promise<Community[]> {
        return this.prisma.community.findMany({
            where: { path },
            include: { user: true },
        });
    }

    findOne({ id }: { id: string }): Promise<Community> {
        return this.prisma.community.update({
            where: { id },
            data: {
                view: { increment: 1 },
            },
            include: {
                comments: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    }
}
