import axios from 'axios';
import cheerio from 'cheerio';
import {
    crawilingType,
    createCrawilingData,
} from '../util/crawilingType';

export const crawilingData = async (path: string) => {
    const length = new Array(3).fill(0);

    return length.map(async (_, i) => {
        const { url, dataType, detailClass, mainImageType } =
            crawilingType(path, i);

        const dataList = await axios.get(url);

        return dataList.data.data.activities.nodes
            .map((el: any) => el.id)
            .forEach(async (el: string) => {
                const result = await axios.get(
                    `https://linkareer.com/activity/${el}`,
                );
                const $ = cheerio.load(result.data);
                $(`h3.${detailClass}`).each((index, el) => {
                    const key = Object.keys(dataType)[index];
                    if (key) {
                        dataType[key as keyof typeof dataType] =
                            $(el).text();
                    }
                });

                const data = {
                    Dday: $('.recruitText').text(),
                    title: $('h2.title').text(),
                    view: String($('span.count').html()) ?? '0',
                    mainImage:
                        $(`img.${mainImageType}`).attr('src') ?? '',
                    organization: $('h2.organization-name').text(),
                    ...dataType,
                    detail:
                        $(
                            'div.ActivityDetailTabContent__StyledWrapper-sc-5db6cf4b-0.bDYgjm',
                        ).html() ?? '없음',
                };
                return createCrawilingData(data, path);
            });
    });
};
