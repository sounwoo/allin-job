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
import AccessGuard from '../../middleware/auth.guard/access.guard';

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
        this.router.get('/data', asyncHandler(this.crawling.bind(this)));

        // this.router.get(
        //     '/myKeywordCrawling',
        //     AccessGuard.handle,
        //     asyncHandler(this.myKeywordCrawling.bind(this)),
        // );
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
        const { path, test } = req.query as createPaths;

        const linkareer = ['outside', 'intern', 'competition'];

        const data = linkareer.includes(path)
            ? await this.pathCrawling.linkareerData(
                  path as createLinkareerPaths,
              )
            : path === 'language'
            ? await this.pathCrawling.languageData({ path, test })
            : await this.pathCrawling.QNetData();

        res.status(data.length ? 200 : 400).json({
            data: data.length ? '성공' : '실패',
        });
    }

    //나의 관심 커리어 조회하기
    // async myKeywordCrawling(req: Request, res: Response) {
    //     // #swagger.tags = ['Crawling']

    //     const userKeyword = await this.userService.findUserKeyword({
    //         id: (req.user as idType).id,
    //         path: (req.query as pathType).path,
    //     });
    //     console.log(userKeyword, '12321312');

    //     let result: object[] = [];
    //     const { count, ...data } = req.query as fidneCrawlingType;

    //     switch (req.query.path) {
    //         case 'competition':
    //             result = await this.crawlingService.findeCrawling({
    //                 ...data,
    //                 interests: userKeyword,
    //             });
    //             break;
    //         case 'outside':
    //             result = await this.crawlingService.findeCrawling({
    //                 ...data,
    //                 field: userKeyword,
    //             });
    //             break;
    //         case 'intern':
    //             result = await this.crawlingService.findeCrawling({
    //                 ...data,
    //                 enterprise: userKeyword,
    //             });
    //             break;
    //         case 'qnet':
    //             const subCategories = userKeyword
    //                 .split(',')
    //                 .map((subcategory) => subcategory.trim());

    //             for (const subCategory of subCategories) {
    //                 const partialResult =
    //                     await this.crawlingService.findeCrawling({
    //                         ...data,

    //                         subCategory,
    //                     });
    //                 result = result.concat(partialResult);
    //             }
    //             break;
    //         case 'language':
    //             //todo
    //             result = await this.crawlingService.findeCrawling({
    //                 ...data,
    //             });
    //             break;
    //         default:
    //             result = [];
    //             break;
    //     }

    //     res.status(200).json({
    //         data: result.length ? (count ? result.length : result) : null,
    //     });
    // }
}
export default new CrawlingController(
    Container.get(CrawlingService),
    Container.get(PathCrawling),
);
