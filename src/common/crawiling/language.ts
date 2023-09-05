import axios from 'axios';
import cheerio from 'cheerio';
import { createLanguageData, languageType } from '../util/crawiling.data';
import { createLanguagePaths } from './interface';

export const languageData = async (path: createLanguagePaths) => {
    const { pathType, dataObj, url } = languageType(path);
    console.log(pathType, dataObj, url);
    const result = await axios.get(url);
    const $ = cheerio.load(result.data);
    $(pathType).each((_, el) => {
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

        createLanguageData({ path, homePage: url, dataObj });
    });
    return ['true'];
};
