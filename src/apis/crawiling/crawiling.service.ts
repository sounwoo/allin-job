import {
    createLanguagePaths,
    createLinkareerPaths,
    createPaths,
    findCrawiling,
    paths,
} from '../../common/crawiling/interface';
import { languageData } from '../../common/crawiling/language';
import { linkareerData } from '../../common/crawiling/linkareer';
import prisma from '../../database/prismaConfig';

export class CrawilingService {
    async findeCrailing({ path }: paths): Promise<findCrawiling> {
        const obj = {
            outside: async () => await prisma.outside.findMany(),
            intern: async () => await prisma.intern.findMany(),
            competition: async () => await prisma.competition.findMany(),
            language: async () =>
                await prisma.language.findMany({ where: { path } }),
        };

        return obj[path] ? obj[path]() : obj['language']();
    }

    async crawiling(path: createPaths): Promise<boolean> {
        let data;
        if (path === 'outside' || path === 'intern' || path === 'competition')
            data = await linkareerData(path as createLinkareerPaths);
        else data = await languageData(path as createLanguagePaths);
        return !!data.length;
    }
}
