import axios from 'axios';
import cheerio from 'cheerio';
import { linkareerType, createLinkareerData } from '../util/crawiling.data';
import { createLinkareerPaths } from './interface';

export const linkareerData = async (path: createLinkareerPaths) => {
    // 이중 배열 만들때 -> 깊은 복사 때문이다.
    // Array.from({ length: 3 }, () => {
    //     return Array.from({ length: 3 }, () => 0);
    // });

    return Array(3)
        .fill(0)
        .map(async (_, i) => {
            const { url, dataType, detailClass, mainImageType } = linkareerType(
                path,
                i,
            );

            const dataList = await axios.get(url);

            return dataList.data.data.activities.nodes.map(async (el: any) => {
                const result = await axios.get(
                    `https://linkareer.com/activity/${el.id}`,
                );
                const $ = cheerio.load(result.data);
                $(`h3.${detailClass}`).each((index, el) => {
                    const key = Object.keys(dataType)[index];
                    if (key) {
                        dataType[key as keyof typeof dataType] = $(el).text();
                    }
                });

                const data = {
                    Dday: $('.recruitText').text(),
                    title: $('h2.title').text(),
                    view: String($('span.count').html()),
                    mainImage: $(`img.${mainImageType}`).attr('src'),
                    organization: $('h2.organization-name').text(),
                    ...dataType,
                    detail: $(
                        'div.ActivityDetailTabContent__StyledWrapper-sc-5db6cf4b-0.bDYgjm',
                    ).html(),
                };
                return createLinkareerData({ data, path });
            });
        });
};
