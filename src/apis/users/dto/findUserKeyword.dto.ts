import { User } from '@prisma/client';
import { IsString } from 'class-validator';

export class FindUserKeywordDTO {
    @IsString()
    id: User['id'];

    @IsString()
    path: string;

    @IsString()
    classify: string;

    constructor(data: FindUserKeywordDTO) {
        this.id = data.id;
        this.path = data.path;
        this.classify = data.classify;
    }
}
