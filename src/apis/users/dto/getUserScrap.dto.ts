import { IsOptional, IsString } from 'class-validator';
import { Path } from '../../../common/crawiling/interface';

export class GetUserScrapDTO {
    @IsString()
    path: Path['path'] | 'language';

    @IsOptional()
    @IsString()
    count?: string;

    @IsOptional()
    @IsString()
    page?: string;

    constructor(data: GetUserScrapDTO) {
        this.path = data.path;
        this.count = data.count;
        this.page = data.page;
    }
}
