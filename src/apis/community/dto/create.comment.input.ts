import { IsString } from 'class-validator';
import { Comment, Community, User } from '@prisma/client';

export class CreateCommunityCommentDTO {
    @IsString()
    communityId: Community['id'];

    @IsString()
    comment: Comment['comment'];

    constructor(data: CreateCommunityCommentDTO) {
        this.communityId = data.communityId;
        this.comment = data.comment;
    }
}
