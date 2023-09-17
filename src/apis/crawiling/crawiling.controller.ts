import { Request, Router, Response } from 'express';
import { CrawilingService } from './crawiling.service';
import { createPaths, paths } from '../../common/crawiling/interface';
import { asyncHandler } from '../../middleware/async.handler';

class CrawilingController {
    router = Router();
    path = '/crawling';

    private crawilingService: CrawilingService;
    constructor() {
        this.init();
        this.crawilingService = new CrawilingService();
    }

    init() {
        this.router.get('/finde', asyncHandler(this.findeCrawiling.bind(this)));
        this.router.get('/data/:path', asyncHandler(this.crawiling.bind(this)));
    }

    async findeCrawiling(req: Request, res: Response) {
        // #swagger.tags = ['Crawling']
        const { ...data } = req.query as paths;

        const result = await this.crawilingService.findeCrailing({
            ...data,
        });

        result.length
            ? res.status(200).json({ data: result })
            : res.status(400).json({ data: null });
    }

    async crawiling(req: Request, res: Response) {
        const path = req.params.path as createPaths;

        const result = await this.crawilingService.crawiling(path);

        result
            ? res.status(200).json({ result: '성공' })
            : res.status(400).json({ result: '실패' });
    }
}
export default new CrawilingController();
