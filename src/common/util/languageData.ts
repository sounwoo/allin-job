import { testType } from '../crawiling/interface';

export const languageName = (test: testType): { test: string } => {
    const data = {
        toeic: 'TOEIC',
        toeicBR: 'TOEIC (Bridge)',
        toeicSW: 'TOEIC (Speaking, Writing)',
        toeicWT: 'TOEIC (Writing)',
        ch: 'TSC 중국어 말하기 시험',
        jp: 'JPT',
        jpSP: 'SJPT 일본어 말하기 시험',
    };
    return { test: data[test] };
};

export const languageExamDate = (Dday: string) => {
    const check = Dday.split(')');

    if (!check[1]) {
        const pattern = /(\d{4})\.(\d{2})\.(\d{2})\(([일월화수목금토])\)/;
        const [, year, month, day] = Dday.match(pattern) as RegExpMatchArray;
        return { examDate: `${year}-${month}-${day}` };
    } else {
        const pattern =
            /(\d{4})\.(\d{2})\.(\d{2})\(([일월화수목금토])\)(오전|낮|오후)(\d{1,2})시(\d{1,2})(?:분)?/;
        const [, year, month, day, dayOfWeek, timeType, hour, minute] =
            Dday.match(pattern) as RegExpMatchArray;
        let formattedDate = `${year}-${month}-${day} ${hour.padStart(
            2,
            '0',
        )}:${minute.padStart(2, '0')}`;

        if (timeType === '오후') {
            let hourInt = parseInt(hour, 10);
            if (hourInt !== 12) hourInt += 12;
            formattedDate = `${year}-${month}-${day} ${hourInt
                .toString()
                .padStart(2, '0')}:${minute.padStart(2, '0')}`;
        } else if (timeType === '낮') {
            let hourInt = parseInt(hour, 10);
            if (hourInt === 12) hourInt = 0;
            formattedDate = `${year}-${month}-${day} ${hourInt
                .toString()
                .padStart(2, '0')}:${minute.padStart(2, '0')}`;
        }
        return { examDate: formattedDate };
    }
};

export const languageOpenDate = (date: string) => {
    const splitDate = date.split('특별추가');
    const splitTwo = splitDate[0].split('~');

    if (splitDate.length >= 2) {
        const start = formDate(splitTwo[0].replace('정기접수:', ''));
        const end = formDate(splitTwo[1]);

        return { openDate: start, closeDate: end };
    } else {
        const start = formDate(splitTwo[0]);
        const end = formDate(splitTwo[1]);
        return { openDate: start, closeDate: end };
    }
};

const formDate = (str: string): string => {
    const datePattern = /(\d{4})\.(\d{2})\.(\d{2})/;
    const timePattern = /(\d{1,2})시/;

    const dateMatch = str.match(datePattern);
    const timeMatch = str.match(timePattern);

    if (!dateMatch || !timeMatch) {
        return '잘못된 형식의 날짜입니다.';
    }
    const formattedDate = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]} ${timeMatch[1]}:00`;
    return formattedDate;
};
