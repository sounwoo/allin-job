import { IsString } from 'class-validator';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Major } from './create-user.dto';

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

    major: Major[];

    @IsString()
    id: User['id'];

    constructor(data: SaveUserMajorDTO) {
        this.prisma = data.prisma;
        this.major = data.major;
        this.id = data.id;
    }
}
