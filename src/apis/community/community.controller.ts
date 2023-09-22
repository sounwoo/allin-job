import { Container } from 'typedi';
import { CommunityService } from './community.service';
import { Request, Response, Router } from 'express';
import { asyncHandler } from '../../middleware/async.handler';
import accessGuard from '../../middleware/auth.guard/access.guard';
import { idType, pathType } from '../../common/types';
import Validate from '../../common/validator/validateDTO';

class CommunityController {
    router = Router();
    path = '/community';

    constructor(
        private readonly communityService: CommunityService, //
    ) {
        this.init();
    }
    init() {
        this.router.post(
            '/create',
            Validate.createCommunity,
            accessGuard.handle,
            asyncHandler(this.create.bind(this)),
        );
        this.router.get(
            '/',
            Validate.findManyCommunity,
            asyncHandler(this.fidneMany.bind(this)),
        );
        this.router.get(
            '/:id',
            Validate.findOneCommunity,
            accessGuard.handle,
            asyncHandler(this.toggleLike.bind(this)),
        );
        this.router.post(
            '/comment',
            accessGuard.handle,
            asyncHandler(this.createComment.bind(this)),
        );
    }

    async create(req: Request, res: Response) {
        // #swagger.tags = ['Community']
        const { id } = req.user as idType;
        const createCommunity = req.body;

        res.status(200).json({
            data: await this.communityService.create({
                id,
                createCommunity,
            }),
        });
    }

    async fidneMany(req: Request, res: Response) {
        // #swagger.tags = ['Community']
        const { path } = req.query as pathType;

        res.status(200).json({
            data: data.length ? data : null,
        });
    }

    async findeOne(req: Request, res: Response) {
        // #swagger.tags = ['Community']
        const { id } = req.params as idType;

        res.status(200).json({
            data: await this.communityService.findOne({ id }),
        });
    }

    async toggleLike(req: Request, res: Response) {
        const { id: userId } = req.user as idType;
        const { id: communityId } = req.params as idType;

        res.status(200).json({
            data: await this.communityService.toggleLike({
                userId,
                communityId,
            }),
        });
    }

    async createComment(req: Request, res: Response) {
        const { id: userId } = req.user as idType;
        const { comment, id: communityId } = req.body;

        res.status(200).json({
            data: await this.communityService.createComment({
                userId,
                communityId,
                comment,
            }),
        });
    }
}

export default new CommunityController(Container.get(CommunityService));
