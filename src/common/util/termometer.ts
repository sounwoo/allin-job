const length = (data: number, num: number): number => {
    return data >= num ? 100 / 5 : ((data / num) * 100) / num;
};

export const percentage = (user: any): number[] => {
    const { userCompetition, userIntern, userLanguage, userOutside, userQnet } =
        user;
    const competitionPercentage = length(userCompetition.length, 5);
    const outsidePercentage = length(userOutside.length, 5);
    const qnetPercentage = length(userQnet.length, 4);
    const languagePercentage = length(userLanguage.length, 4);
    const internPercentage = length(userIntern.length, 2);

    const sum =
        competitionPercentage +
        outsidePercentage +
        qnetPercentage +
        languagePercentage +
        internPercentage;

    return [
        competitionPercentage,
        outsidePercentage,
        qnetPercentage,
        languagePercentage,
        internPercentage,
        sum,
    ];
};
