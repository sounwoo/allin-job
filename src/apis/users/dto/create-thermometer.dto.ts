import { UserCompetition, UserIntern, UserLanguage } from '@prisma/client';
import { IsString } from 'class-validator';
import { paths } from '../../../common/crawiling/interface';
export class CreateThermometerDTO {
    @IsString()
    path: paths['path'];

    @IsString()
    category: UserCompetition['category'];

    @IsString()
    activeTitle: UserCompetition['activeTitle'];

    @IsString()
    activeContent: UserCompetition['activeContent'];

    @IsString()
    period?: UserIntern['period'];

    @IsString()
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
