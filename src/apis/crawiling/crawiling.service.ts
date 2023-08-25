import { Competition } from '@prisma/client';
import { competition } from '../../common/crawiling/linkareer.competition';
import prisma from '../../database/prismaConfig';

export class CrawilingService {
    async findeCrawiling(): Promise<Competition[]> {
        return prisma.competition.findMany();
    }

    async crawiling(path: string): Promise<boolean> {
        let data: any;

        if (path === 'competition') data = await competition();

        return data?.length ? true : false;
    }
}
