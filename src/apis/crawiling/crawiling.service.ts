import { Competition, Intern, Outside } from '@prisma/client';
import { crawilingData } from '../../common/crawiling/linkareer.competition';
import prisma from '../../database/prismaConfig';
import { paths } from '../../common/types';

export class CrawilingService {
    async findeCrailing({
        path,
    }: paths): Promise<Competition[] | Outside[] | Intern[]> {
        const obj = {
            outside: async () => await prisma.outside.findMany(),
            intern: async () => await prisma.intern.findMany(),
            competition: async () => await prisma.competition.findMany(),
        };

        return obj[path]();
    }

    async crawiling(path: string): Promise<boolean> {
        const data = await crawilingData(path);
        return !!data.length;
    }
}
