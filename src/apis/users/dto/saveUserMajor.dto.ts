import { IsString } from 'class-validator';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export class SaveUserMajorDTO {
    prisma: Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        | '$connect'
        | '$disconnect'
        | '$on'
        | '$transaction'
        | '$use'
        | '$extends'
    >;

    major: object;

    @IsString()
    id: User['id'];

    constructor(data: SaveUserMajorDTO) {
        this.prisma = data.prisma;
        this.major = data.major;
        this.id = data.id;
    }
}
