import { testType } from '../crawiling/interface';
import { formDate } from './formDate';

export const languageData = (test: testType, Dday: string, date: string) => {
    const data = {
        toeic: 'TOEIC',
        toeicBR: 'TOEIC (Bridge)',
        toeicSW: 'TOEIC (Speaking, Writing)',
        toeicWT: 'TOEIC (Writing)',
        toeicST: 'TOEIC (Speaking)',
        ch: 'TSC 중국어 말하기 시험',
        jp: 'JPT',
        jpSP: 'SJPT 일본어 말하기 시험',
    };

    const examDate = formDate(Dday);

    const openDate = formDate(
        date.split('특별추가')[0].split('~')[0].replace('정기접수:', ''),
    );
    const closeDate = formDate(date.split('특별추가')[0].split('~')[1]);

    return { test: data[test], examDate, openDate, closeDate };
};
