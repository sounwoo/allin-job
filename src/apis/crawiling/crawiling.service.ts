import { Competition, Intern, Outside } from '@prisma/client';
import { crawilingData } from '../../common/crawiling/linkareer.competition';
import prisma from '../../database/prismaConfig';

export class CrawilingService {
    async findeCompetition(): Promise<Competition[]> {
        return prisma.competition.findMany();
    }

    async findeOutside(): Promise<Outside[]> {
        return prisma.outside.findMany();
    }

    async findeIntern(): Promise<Intern[]> {
        return prisma.intern.findMany();
    }

    async crawiling(path: string): Promise<boolean> {
        const data = await crawilingData(path);

        return data.length ? true : false;
    }
}
