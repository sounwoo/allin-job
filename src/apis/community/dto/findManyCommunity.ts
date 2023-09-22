import { CreateCommunityDTO } from './create.input';

export class FindManyCommunityDTO {
    path: CreateCommunityDTO['path'];

    constructor(data: FindManyCommunityDTO) {
        this.path = data.path;
    }
}
