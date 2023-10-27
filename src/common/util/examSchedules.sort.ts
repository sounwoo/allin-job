export const examSchedulesSort = (data: any) => {
    const now = new Date();
    const utcNow = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
    const examSchedules = data._source.examSchedules.filter((el: any) => {
        return utcNow < new Date(el.resultDay).getTime();
    });

    return {
        mainImage: process.env.QNET_IMAGE,
        examSchedules: examSchedules.length ? [examSchedules[0]] : null,
    };
};
