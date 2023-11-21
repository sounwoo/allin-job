import { IsString } from 'class-validator';

export class GetCalenderDTO {
    @IsString()
    year: string;

    @IsString()
    month: string;

    constructor(data: GetCalenderDTO) {
        this.year = data.year;
        this.month = data.month;
    }
}
