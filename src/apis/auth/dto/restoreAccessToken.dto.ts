import { IsString } from 'class-validator';

export class restoreAccessTokenDTO {
    @IsString()
    id: string;

    constructor(data: restoreAccessTokenDTO) {
        this.id = data.id;
    }
}
