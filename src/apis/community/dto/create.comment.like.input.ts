import { IsString } from 'class-validator';
import { Comment } from '@prisma/client';

export class CommentLikeCommunityDTO {
    @IsString()
    commentId: Comment['id'];

    constructor(data: CommentLikeCommunityDTO) {
        this.commentId = data.commentId;
    }
}
