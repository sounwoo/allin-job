import { Request, Router, Response } from 'express';
import { CrawlingService } from './crawling.service';
import { Container } from 'typedi';
import {
    createLanguagePaths,
    createLinkareerPaths,
    createPaths,
    fidneCrawlingType,
    findeDetailType,
} from '../../common/crawiling/interface';
import { asyncHandler } from '../../middleware/async.handler';
import { PathCrawling } from '../../common/crawiling/path.crwaling';

class CrawlingController {
    router = Router();
    path = '/crawling';

    constructor(
        private readonly crawlingService: CrawlingService, //
        private readonly pathCrawling: PathCrawling,
    ) {
        this.init();
    }

    init() {
        this.router.get('/finde', asyncHandler(this.findeCrawling.bind(this)));
        this.router.get(
            '/findeDetail',
            asyncHandler(this.findeDetailCrawling.bind(this)),
        );
        this.router.get('/data/:path', asyncHandler(this.crawling.bind(this)));
    }

    async findeCrawling(req: Request, res: Response) {
        // #swagger.tags = ['Crawling']
        const { count, ...data } = req.query as fidneCrawlingType;
        const result = await this.crawlingService.findeCrawling({
            ...data,
        });

        res.status(200).json({
            data: result.length ? (count ? result.length : result) : null,
        });
    }

    async findeDetailCrawling(req: Request, res: Response) {
        // #swagger.tags = ['Crawling']
        const { path, id } = req.query as findeDetailType;
        res.status(200).json({
            data: await this.crawlingService.findeDetailCrawling({ path, id }),
        });
    }

    async crawling(req: Request, res: Response) {
        const path = req.params.path as createPaths;

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
            ? await this.pathCrawling.linkareerData(
                  path as createLinkareerPaths,
              )
            : language.includes(path)
            ? await this.pathCrawling.languageData(path as createLanguagePaths)
            : await this.pathCrawling.QNetData();

        res.status(data.length ? 200 : 400).json({
            data: data.length ? '성공' : '실패',
        });
    }
}
export default new CrawlingController(
    Container.get(CrawlingService),
    Container.get(PathCrawling),
);
