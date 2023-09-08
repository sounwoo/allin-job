import axios from 'axios';
import cheerio from 'cheerio';
import iconv from 'iconv-lite';
import { QNetObj } from '../util/seed.q-net';
import { examSchedule, itmeType } from './interface';
import { createQNetData, examScheduleObj } from '../util/crawiling.data';

const decode = require('decode-html');

export const QNetData = async () => {
    // http://openapi.q-net.or.kr/api/service/rest/InquiryListNationalQualifcationSVC/getList?serviceKey=sWAEtBKCgnfT4ANvlYmgqRju8t9TcJHpyQvLY5zz6qu%2BRzrrMv%2FQyMHjzYUbtK%2FTJqePrdyM2nVPzTwEImSGvQ%3D%3D&
    const listUrl =
        'http://openapi.q-net.or.kr/api/service/rest/InquiryQualInfo/getList?serviceKey=sWAEtBKCgnfT4ANvlYmgqRju8t9TcJHpyQvLY5zz6qu%2BRzrrMv%2FQyMHjzYUbtK%2FTJqePrdyM2nVPzTwEImSGvQ%3D%3D&seriesCd=';

    // 국가기술자격
    const dataList = await Promise.all(
        ['01', '02', '03', '04'].map(async (el) => {
            return await axios
                .get(`${listUrl}${el}`)
                .then((result) => result.data.response.body.items.item)
                .catch((err) => console.log(err));
        }),
    );

    dataList.forEach((arr) => {
        arr.forEach(async (el: itmeType) => {
            const { jmCd, implNm, engJmNm, instiNm, jmNm } = el;
            if (QNetObj[jmCd]) {
                const dataList = await axios.get(
                    `https://www.q-net.or.kr/crf005.do?id=crf00503s02&gSite=Q&gId=&jmCd=${jmCd}&jmInfoDivCcd=B0&jmNm=${implNm}`,
                    { responseType: 'arraybuffer' },
                );
                const decodedHTML = iconv.decode(dataList.data, 'EUC-KR');
                const $ = cheerio.load(decodedHTML);
                const examSchedules: examSchedule[] = [];

                $('tbody > tr').each((_, el) => {
                    examScheduleObj;
                    $(el)
                        .find('td')
                        .each((indexs, els) => {
                            const key = Object.keys(examScheduleObj)[indexs];
                            if (key) {
                                examScheduleObj[
                                    key as keyof typeof examScheduleObj
                                ] = $(els).text().replace(/\s+/g, '');
                            }
                        });
                    examSchedules.push(examScheduleObj);
                });

                let detail =
                    $('div.dlInfo.mb40').text() &&
                    decode($('div.dlInfo.mb40').html());

                detail = detail.replaceAll(
                    /<textarea[^>]*>([\s\S]*?)<body[^>]*>/gi,
                    '',
                );
                detail = detail.replaceAll(
                    /<\/body[^>]*>([\s\S]*?)<\/textarea[^>]*>/gi,
                    '',
                );
                const data = {
                    detail,
                    scheduleInfo: $('div.infoBox.mt10.mb40').html() ?? '',
                    examSchedules,
                    jmNm,
                    engJmNm,
                    instiNm,
                    implNm,
                };

                createQNetData({ data });
            }
        });
    });
    return ['true'];
};
