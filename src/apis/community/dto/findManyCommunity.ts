import { CreateCommunityDTO } from './create.input';

export class FindManyCommunityDTO {
    path: CreateCommunityDTO['path'];

    constructor(data: Pick<CreateCommunityDTO, 'path'>) {
        this.path = data.path;
    }
}
