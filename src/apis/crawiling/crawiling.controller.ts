import { Request, Router, Response } from 'express';
import { CrawlingService } from './crawiling.service';
import {
    createPaths,
    fidneCrawlingType,
    findeDetailType,
} from '../../common/crawiling/interface';
import { asyncHandler } from '../../middleware/async.handler';

class CrawlingController {
    router = Router();
    path = '/crawling';

    private crawlingService: CrawlingService;
    constructor() {
        this.init();
        this.crawlingService = new CrawlingService();
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
        res.status(400).json({
            data: await this.crawlingService.findeDetailCrawling({ path, id }),
        });
    }

    async crawling(req: Request, res: Response) {
        const path = req.params.path as createPaths;

        const result = await this.crawlingService.crawling(path);

        result
            ? res.status(200).json({ result: '성공' })
            : res.status(400).json({ result: '실패' });
    }
}
export default new CrawlingController();
