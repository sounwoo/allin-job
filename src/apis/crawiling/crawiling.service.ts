import {
    createPaths,
    findCrawiling,
    paths,
} from '../../common/crawiling/interface';
import { linkareerData } from '../../common/crawiling/linkareer';
import prisma from '../../database/prismaConfig';

export class CrawilingService {
    async findeCrailing({ path }: paths): Promise<findCrawiling> {
        const obj = {
            outside: async () => await prisma.outside.findMany(),
            intern: async () => await prisma.intern.findMany(),
            competition: async () => await prisma.competition.findMany(),
        };

        return obj[path]();
    }

    async crawiling(path: createPaths): Promise<boolean> {
        const data = await linkareerData(path);
        return !!data.length;
    }
}
