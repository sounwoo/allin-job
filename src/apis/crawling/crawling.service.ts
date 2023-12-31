import {
    Path,
    createLinkareerPaths,
    createQNet,
    findeDetailType,
    languagePath,
    paths,
} from '../../common/crawiling/interface';
import { Service } from 'typedi';
import { UserService } from '../users/users.service';
import { ElasitcClient } from '../../database/elasticConfig';
import { CommunityService } from '../community/community.service';
import { cludes } from '../../common/util/return_data_cludes';
import { bestDataType } from './interfaces/returnType/bestData.interface';
import { findeDetailCrawling } from './interfaces/returnType/findDetailCrawling.interface';
import { findCrawling } from './interfaces/returnType/findeCrawling.interface';
import { examSchedulesSort } from '../../common/util/examSchedules.sort';

@Service()
export class CrawlingService {
    constructor(
        private readonly elastic: ElasitcClient,
        private readonly userService: UserService,
        private readonly communityService: CommunityService,
    ) {}

    async findeCrawling({ ...data }: paths): Promise<findCrawling[]> {
        const { path, page, classify, count, ..._data } = data;

        const datas: { [key: string]: string } = { ..._data };
        const must: object[] = [];
        for (const key in _data) {
            const value = datas[key];
            if (key === 'scale') {
                const [start, end] = value.split(',');
                const scaleKeyword = !end
                    ? { gte: +start }
                    : { gte: +start || 0, lte: +end };
                must.push({ range: { [key]: scaleKeyword } });
            } else {
                must.push({
                    match: { [key]: value.replace(',', ' ') },
                });
            }
        }

        return this.elastic
            .search({
                index: `${path}*`,
                _source_includes: cludes(path),
                body: {
                    query: {
                        ...(must.length
                            ? {
                                  bool: { must },
                              }
                            : { match_all: {} }),
                    },
                    size: 12,
                    from: (+page - 1 || 0) * 12,
                },
            })
            .then((data) => {
                return count
                    ? data.body.hits.total.value
                    : data.body.hits.hits.length
                    ? data.body.hits.hits.map((el: any) => {
                          return {
                              id: el._id,
                              ...el._source,
                              ...(path === 'qnet' && {
                                  ...examSchedulesSort(el),
                              }),
                          };
                      })
                    : null;
            });
    }

    async myKeywordCrawling({
        ...data
    }: paths & { id: string }): Promise<findCrawling[]> {
        const userKeyword = await this.userService.findUserKeyword({
            ...data,
        });
        const obj = {
            competition: 'interests',
            outside: 'field',
            intern: 'institution',
            qnet: 'mainCategory',
            language: 'test',
        };
        const { id, ..._data } = { ...data };
        const params = {
            ..._data,
            ...(userKeyword.length && { [obj[data.path]]: userKeyword }),
        };

        return this.findeCrawling(params);
    }

    async findeDetailCrawling({
        path,
        id,
    }: findeDetailType): Promise<findeDetailCrawling | null> {
        return this.elastic
            .update(
                {
                    index: path,
                    id,
                    body: {
                        script: {
                            source: 'ctx._source.view++',
                        },
                        _source: true,
                    },
                },
                { ignore: [404] },
            )
            .then((el) =>
                el.body.error ? el.meta.context : el.body.get._source,
            );
    }

    async createLanguageData({
        classify,
        test,
        homePage,
        dataObj,
    }: languagePath): Promise<boolean> {
        await this.elastic.index({
            index: 'language',
            body: {
                test,
                classify,
                homePage,
                scrap: 0,
                ...dataObj,
            },
        });
        return true;
    }

    async createLinkareerData<T extends object>({
        data,
        path,
        month,
        scale,
    }: {
        data: T;
        path: createLinkareerPaths;
        month: number;
        scale?: number | undefined;
    }): Promise<boolean> {
        await this.elastic.index({
            index: path,
            body: {
                ...data,
                scrap: 0,
                ...(scale && { scale }),
                ...(month && { month }),
            },
        });

        return true;
    }

    async createQNetData({ data, categoryObj }: createQNet): Promise<boolean> {
        await this.elastic.index({
            index: 'qnet',
            body: {
                ...data,
                ...categoryObj,
            },
        });

        return true;
    }

    async bsetData({
        path,
    }: Path | { path: 'community' }): Promise<bestDataType[]> {
        if (path === 'community') return this.communityService.findeMany({});

        return this.elastic
            .search({
                index: path,
                _source_includes: cludes(path),
                body: {
                    sort: { view: { order: 'desc' } },
                    query: {
                        match_all: {},
                    },
                },
                size: 12,
            })
            .then((el) =>
                el.body.hits.hits.map((el: any) => ({
                    id: el._id,
                    ...el._source,
                    ...(path === 'qnet' && {
                        ...examSchedulesSort(el),
                    }),
                })),
            );
    }
}
