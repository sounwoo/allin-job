import {
    createLanguagePaths,
    createLinkareerPaths,
    createPaths,
    findCrawiling,
    paths,
} from '../../common/crawiling/interface';
import { languageData } from '../../common/crawiling/language';
import { linkareerData } from '../../common/crawiling/linkareer';
import { QNetData } from '../../common/crawiling/q-net';
import prisma from '../../database/prismaConfig';

export class CrawilingService {
    async findeCrailing({ path }: paths): Promise<findCrawiling> {
        const obj = {
            outside: () => prisma.outside.findMany(),
            intern: () => prisma.intern.findMany(),
            competition: () => prisma.competition.findMany(),
            language: () => prisma.language.findMany({ where: { path } }),
            qnet: () =>
                prisma.qNet.findMany({ include: { examSchedules: true } }),
        };

        return (obj[path] || obj['language'])();
    }

    async crawiling(path: createPaths): Promise<boolean> {
        const linkareer = ['outside', 'intern', 'competition'];
        const language = [
            'toeic',
            'toeicBR',
            'toeicSW',
            'toeicWT',
            'toeicST',
            'ch',
            'jp',
            'jpSP',
        ];
        const data = linkareer.includes(path)
            ? await linkareerData(path as createLinkareerPaths)
            : language.includes(path)
            ? await languageData(path as createLanguagePaths)
            : await QNetData();

        return !!data.length;
    }
}
