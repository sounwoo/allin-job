export const splitDate = (date: string) => {
    return date && date.split('~')[1].trim();
};
