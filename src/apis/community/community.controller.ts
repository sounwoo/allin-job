import { Container } from 'typedi';
import { CommunityService } from './community.service';
import { Request, Response, Router } from 'express';
import { asyncHandler } from '../../middleware/async.handler';
import accessGuard from '../../middleware/auth.guard/access.guard';
import { idType, pathType } from '../../common/types';
import { validateDTO } from '../../common/validator/validateDTO';
import { CreateCommunityDTO } from './dto/create.input';
import { FindOneCommunityDTO } from './dto/findOneCommunity';
import { FindManyCommunityDTO } from './dto/findManyCommunity';
import { ToggleLikeCommunityDTO } from './dto/toggleLikeCommunity';
import { CreateCommunityCommentDTO } from './dto/create.comment.input';

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
            accessGuard.handle,
            asyncHandler(this.create.bind(this)),
        );
        this.router.get('/', asyncHandler(this.fidneMany.bind(this)));
        this.router.get('/:id', asyncHandler(this.findeOne.bind(this)));
        this.router.patch(
            '/like/:id',
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

        await validateDTO(new CreateCommunityDTO(createCommunity));

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
        console.log(path);
        path &&
            (await validateDTO(
                new FindManyCommunityDTO(req.query as pathType),
            ));
        const data = await this.communityService.findeMany({ path });
        res.status(200).json({
            data: data.length ? data : null,
        });
    }

    async findeOne(req: Request, res: Response) {
        // #swagger.tags = ['Community']
        const { id } = req.params as idType;
        await validateDTO(new FindOneCommunityDTO(req.params as idType));

        res.status(200).json({
            data: await this.communityService.findOne({ id }),
        });
    }

    async toggleLike(req: Request, res: Response) {
        // #swagger.tags = ['Community']
        const { id: userId } = req.user as idType;
        const { id: communityId } = req.params as idType;

        await validateDTO(new ToggleLikeCommunityDTO({ userId, communityId }));
        const toggleLikes = await this.communityService.toggleLike({
            userId,
            communityId,
        });

        res.status(200).json({
            data: toggleLikes.length
                ? { count: toggleLikes.length, toggleLikes }
                : null,
        });
    }

    async createComment(req: Request, res: Response) {
        // #swagger.tags = ['Community']
        const { id: userId } = req.user as idType;
        const { comment, id: communityId } = req.body;

        await validateDTO(
            new CreateCommunityCommentDTO({ userId, communityId, comment }),
        );

        const comments = await this.communityService.createComment({
            userId,
            communityId,
            comment,
        });

        res.status(200).json({
            data: comments.length ? { count: comments.length, comments } : null,
        });
    }
}

export default new CommunityController(Container.get(CommunityService));
