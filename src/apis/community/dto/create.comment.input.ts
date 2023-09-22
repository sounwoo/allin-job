import { IsString } from 'class-validator';
import { ICommunityToggleLike } from '../interfaces/community.interface';
import { Comment } from '@prisma/client';

export class CreateCommunityCommentDTO {
    userId: ICommunityToggleLike['userId'];
    communityId: ICommunityToggleLike['communityId'];

    @IsString()
    comment: Comment['comment'];

    constructor(data: CreateCommunityCommentDTO) {
        this.userId = data.userId;
        this.communityId = data.communityId;
        this.comment = data.comment;
    }
}
