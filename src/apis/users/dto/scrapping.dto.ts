import { IsString } from 'class-validator';
import { User } from '@prisma/client';
import { Path } from '../../../common/crawiling/interface';

export class ScrappingDTO {
    @IsString()
    path: Path['path'] | 'language';

    @IsString()
    scrapId: string;

    constructor(data: ScrappingDTO) {
        this.path = data.path;
        this.scrapId = data.scrapId;
    }
}
