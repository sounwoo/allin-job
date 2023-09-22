import { Service } from 'typedi';
import { UserService } from '../users/users.service';
import CustomError from '../../common/error/customError';
import { Comment, Community, CommunityLike } from '@prisma/client';
import { CustomPrismaClient } from '../../database/prismaConfig';
import {
    ICommunityCreate,
    ICommunityToggleLike,
} from './interfaces/community.interface';
import { idType, pathType } from '../../common/types';
import { CreateCommunityCommentDTO } from './dto/create.comment.input';

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

    findeMany({ path }: pathType): Promise<Community[]> {
        return this.prisma.community.findMany({
            where: { path },
            include: {
                user: true,
            },
        });
    }

    findOne({ id }: idType): Promise<Community> {
        return this.prisma.community.update({
            where: { id },
            data: {
                view: { increment: 1 },
            },
            include: {
                user: true,
                comments: {
                    include: {
                        user: true,
                    },
                },
                communitiyLikes: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    }
    async toggleLike({
        userId,
        communityId,
    }: ICommunityToggleLike): Promise<CommunityLike[]> {
        const isUser = await this.userService.isUserByID(userId);
        if (!isUser) throw new CustomError('존재하지 않는 아이디입니다.', 400);

        const likeCommunity = await this.prisma.communityLike.findFirst({
            where: { AND: [{ communityId, userId }] },
        });

        return this.prisma.community
            .update({
                where: { id: communityId },
                data: {
                    likeCount: likeCommunity
                        ? { decrement: 1 }
                        : { increment: 1 },
                    communitiyLikes: likeCommunity
                        ? { delete: { id: likeCommunity.id } }
                        : { create: { userId } },
                },
                include: {
                    communitiyLikes: {
                        include: {
                            user: true,
                        },
                    },
                },
            })
            .then((el) => el.communitiyLikes);
    }

    async createComment({
        userId,
        communityId,
        comment,
    }: CreateCommunityCommentDTO): Promise<Comment[]> {
        const isUser = await this.userService.isUserByID(userId);
        if (!isUser) throw new CustomError('존재하지 않는 아이디입니다.', 400);

        return await this.prisma.community
            .update({
                where: { id: communityId },
                data: {
                    commentCount: { increment: 1 },
                    comments: {
                        create: {
                            comment,
                            userId,
                        },
                    },
                },
                include: {
                    comments: {
                        include: {
                            user: true,
                        },
                        orderBy: {
                            createAt: 'desc',
                        },
                    },
                },
            })
            .then((el) => el.comments);
    }
}
