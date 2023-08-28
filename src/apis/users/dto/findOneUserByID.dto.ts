import { IsString } from 'class-validator';

export class FindOneUserByIdDTO {
    @IsString()
    name: string;

    @IsString()
    phone: string;

    constructor(data: FindOneUserByIdDTO) {
        this.name = data.name;
        this.phone = data.phone;
    }
}
