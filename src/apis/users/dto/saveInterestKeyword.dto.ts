import { IsString } from 'class-validator';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Interests } from './create-user.dto';

export class SaveInterestKeywordDTO {
    prisma: Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        | '$connect'
        | '$disconnect'
        | '$on'
        | '$transaction'
        | '$use'
        | '$extends'
    >;

    interests: Interests[];

    @IsString()
    id: User['id'];

    constructor(data: SaveInterestKeywordDTO) {
        this.prisma = data.prisma;
        this.interests = data.interests;
        this.id = data.id;
    }
}
