import { IsString, Length, Matches } from 'class-validator';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

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

    interests: object[];

    @IsString()
    id: User['id'];

    constructor(data: SaveInterestKeywordDTO) {
        this.prisma = data.prisma;
        this.interests = data.interests;
        this.id = data.id;
    }
}
