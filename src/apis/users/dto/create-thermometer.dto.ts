import {
    Keyword,
    UserCompetition,
    UserIntern,
    UserLanguage,
} from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import { Path } from '../../../common/crawiling/interface';

export class CreateThermometerDTO {
    @IsString()
    path: Path['path'] | 'language';

    @IsString()
    @IsOptional()
    category: UserCompetition['category'];

    @IsString()
    @IsOptional()
    activeTitle: UserCompetition['activeTitle'];

    @IsString()
    @IsOptional()
    activeContent: UserCompetition['activeContent'];

    @IsString()
    @IsOptional()
    period?: UserIntern['period'];

    @IsString()
    @IsOptional()
    score?: UserLanguage['score'];

    constructor(data: CreateThermometerDTO) {
        this.path = data.path;
        this.category = data.category;
        this.activeTitle = data.activeTitle;
        this.activeContent = data.activeContent;
        this.period = data.period;
        this.score = data.score;
    }
}
