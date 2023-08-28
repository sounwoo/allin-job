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
                const Dday = $('.recruitText').text();
                const title = $('h2.title').text();
                const view = String($('span.count').html()) ?? '0';
                const mainImage =
                    $(`img.${mainImageType}`).attr('src') ?? '';
                const organization = $('h2.organization-name').text();
                const organizationObj = dataType;
                const hClass = detailClass;
                console.log(`${title} : ${mainImage}`);
                $(`h3.${hClass}`).each((index, el) => {
                    const key = Object.keys(organizationObj)[index];
                    if (key) {
                        organizationObj[
                            key as keyof typeof organizationObj
                        ] = $(el).text();
                    }
                });
                const detail =
                    $(
                        'div.ActivityDetailTabContent__StyledWrapper-sc-5db6cf4b-0.bDYgjm',
                    ).html() ?? '없음';

                const data = {
                    Dday,
                    title,
                    view,
                    mainImage,
                    organization,
                    ...organizationObj,
                    detail,
                };
                return createCrawilingData(data, path);
            });
    });
};
