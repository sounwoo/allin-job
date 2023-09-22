import { IsString } from 'class-validator';
import { Comment, Community, User } from '@prisma/client';

export class CreateCommunityCommentDTO {
    @IsString()
    userId: User['id'];

    @IsString()
    communityId: Community['id'];

    @IsString()
    comment: Comment['comment'];

    constructor(data: CreateCommunityCommentDTO) {
        this.userId = data.userId;
        this.communityId = data.communityId;
        this.comment = data.comment;
    }
}
