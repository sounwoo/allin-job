import { Request, Router, Response } from 'express';
import { CrawilingService } from './crawiling.service';

class CrawilingController {
    router = Router();
    path = '/crawiling';

    private crawilingService: CrawilingService;
    constructor() {
        this.init();
        this.crawilingService = new CrawilingService();
    }

    init() {
        this.router.get('/data/:path', this.crawiling.bind(this));
        this.router.get(
            '/finde/:path',
            this.findeCrawiling.bind(this),
        );
    }

    async crawiling(req: Request, res: Response) {
        const { path } = req.params;
        const result = await this.crawilingService.crawiling(path);

        result
            ? res.status(200).json({ result: '성공' })
            : res.status(400).json({ result: '실패' });
    }

    async findeCrawiling(req: Request, res: Response) {
        const { path } = req.params;
        let result;
        switch (path) {
            case 'outside':
                result = await this.crawilingService.findeOutside();
                break;
            case 'intern':
                result = await this.crawilingService.findeIntern();
                break;
            default:
                result =
                    await this.crawilingService.findeCompetition();
        }

        result.length
            ? res.status(200).json({ data: result })
            : res.status(400).json({ data: '없음' });
    }
}
export default new CrawilingController();
