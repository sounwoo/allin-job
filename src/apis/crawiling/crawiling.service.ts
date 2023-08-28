import { Competition, Intern } from '@prisma/client';
import { crawilingData } from '../../common/crawiling/linkareer.competition';
import prisma from '../../database/prismaConfig';

export class CrawilingService {
    async findeCompetition(): Promise<Competition[]> {
        return prisma.competition.findMany();
    }

    async findeIntern(): Promise<Intern[]> {
        return prisma.intern.findMany();
    }

    async crawiling(path: string): Promise<boolean> {
        const data = await crawilingData(path);

        return data.length ? true : false;
    }
}
