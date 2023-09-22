import axios from 'axios';
import cheerio from 'cheerio';
import { createLanguageData, languageType } from '../util/crawiling.data';
import { createLanguagePaths, createPaths, testType } from './interface';

export const languageData = async ({ path, test }: createPaths) => {
    const { testType, dataObj, url } = languageType(test);
    const result = await axios.get(url);
    const $ = cheerio.load(result.data);
    $(testType).each((_, el) => {
        $(el)
            .find('td')
            .each((indexs, els) => {
                const key = Object.keys(dataObj)[indexs];
                if (key) {
                    dataObj[key as keyof typeof dataObj] = $(els)
                        .text()
                        .replace(/\s+/g, '');
                }
            });
        let classify: string = '영어';
        if (test.includes('ch')) classify = '중국어';
        else if (test.includes('jp')) classify = '일본어';

        createLanguageData({ test, classify, homePage: url, dataObj });
    });
    1;
    return ['true'];
};
