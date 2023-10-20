import { IsString } from 'class-validator';
import { User } from '@prisma/client';
import { Path } from '../../../common/crawiling/interface';

export class GetUserScrapDTO {
    @IsString()
    id: User['id'];

    @IsString()
    path: Path['path'] | 'language';

    constructor(data: GetUserScrapDTO) {
        this.id = data.id;
        this.path = data.path;
    }
}
