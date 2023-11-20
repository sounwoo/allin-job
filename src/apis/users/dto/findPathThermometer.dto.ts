import { IsString } from 'class-validator';
import { Path } from '../../../common/crawiling/interface';

export class FindPathThermometerDTO {
    @IsString()
    path: Path['path'] | 'language';

    constructor(data: FindPathThermometerDTO) {
        this.path = data.path;
    }
}
