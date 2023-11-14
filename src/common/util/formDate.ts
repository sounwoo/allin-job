export const formDate = (date: string): string => {
    const timeStr = date.split(')')[1];
    const dateStr = date.split(')')[0].split('(')[0];

    if (!timeStr) return dateStr.replaceAll('.', '-');

    let time = timeStr.split('시')[0];
    const minuteStr = timeStr.split('시')[1];

    time = time.split(
        timeStr.includes('오후')
            ? '오후'
            : timeStr.includes('밤')
            ? '밤'
            : timeStr.includes('오전')
            ? '오전'
            : '낮',
    )[1];

    if (timeStr.includes('오후') || timeStr.includes('밤')) {
        time = String(+time + 12);
    } else if (+time < 10) {
        time = '0' + String(time);
    }

    const minute =
        (+minuteStr.slice(0, -1) < 10 && '0') + minuteStr.slice(0, -1);

    return `${dateStr.replaceAll('.', '-')} ${time}:${
        minuteStr ? minute : '00'
    }`;
};
