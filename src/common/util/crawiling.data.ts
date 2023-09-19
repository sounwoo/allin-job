import { Language, MainCategory, QNet, SubCategory } from '@prisma/client';
import { CustomPrismaClient } from '../../database/prismaConfig';
import {
    OutsideType,
    InternType,
    CompetitionType,
    createCrawiling,
    languagePath,
    languageDetail,
    createLinkareerPaths,
    createQNet,
} from '../crawiling/interface';
const prisma = new CustomPrismaClient();
export const linkareerType = (path: string, i: number) => {
    let url, dataType;
    let interestsType = 'jss14';
    let detailClass = 'jss6';
    let mainImageType = 'card-image';

    switch (path) {
        case 'outside':
            url = `https://api.linkareer.com/graphql?operationName=ActivityList_Activities&variables=%7B%22filterBy%22%3A%7B%22status%22%3A%22OPEN%22%2C%22activityTypeID%22%3A%221%22%7D%2C%22pageSize%22%3A20%2C%22page%22%3A${
                i + 1
            }%2C%22activityOrder%22%3A%7B%22field%22%3A%22CREATED_AT%22%2C%22direction%22%3A%22DESC%22%7D%2C%22withManager%22%3Atrue%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%228825f82938c33738717c30842b55557c56990f963907c69bac8e9d19ea484359%22%7D%7D`;
            dataType = {
                enterprise: '',
                target: '',
                applicationPeriod: '',
                participationPeriod: '',
                personnel: '',
                region: '',
                preferentialTreatment: '',
                homePage: '',
                benefits: '',
                interests: '',
                field: '',
            };

            break;

        case 'intern':
            url = `https://api.linkareer.com/graphql?operationName=RecruitList&variables=%7B%22filterBy%22%3A%7B%22status%22%3A%22OPEN%22%2C%22activityTypeID%22%3A%225%22%2C%22jobTypes%22%3A%5B%22INTERN%22%5D%2C%22categoryIDs%22%3A%5B%5D%7D%2C%22activityOrder%22%3A%7B%22field%22%3A%22RECENT%22%2C%22direction%22%3A%22DESC%22%7D%2C%22page%22%3A${
                i + 1
            }%2C%22pageSize%22%3A20%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22cacb5fff62346779e715a849c212cd8ce31b37c4154bb7e6508239063281c825%22%7D%7D`;
            dataType = {
                enterprise: '',
                applicationPeriod: '',
                preferentialTreatment: '',
                personnel: '',
                target: '',
                homePage: '',
                region: '',
            };
            detailClass = 'jss5';
            mainImageType = 'recruit-image';

            break;
        default:
            url = `https://api.linkareer.com/graphql?operationName=ActivityList_Activities&variables=%7B%22filterBy%22%3A%7B%22status%22%3A%22OPEN%22%2C%22activityTypeID%22%3A%223%22%7D%2C%22pageSize%22%3A20%2C%22page%22%3A${
                i + 1
            }%2C%22activityOrder%22%3A%7B%22field%22%3A%22CREATED_AT%22%2C%22direction%22%3A%22DESC%22%7D%2C%22withManager%22%3Atrue%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%228825f82938c33738717c30842b55557c56990f963907c69bac8e9d19ea484359%22%7D%7D`;
            dataType = {
                enterprise: '',
                target: '',
                scale: '',
                applicationPeriod: '',
                homePage: '',
                benefits: '',
                interests: '',
            };
            interestsType = 'jss13';

            break;
    }

    return { url, dataType, detailClass, mainImageType, interestsType };
};

export const createLinkareerData = async <T extends object>({
    data,
    path,
    month,
}: {
    data: T;
    path: createLinkareerPaths;
    month: number;
}): Promise<createCrawiling> => {
    const result = {
        outside: async () =>
            await prisma.outside.create({
                data: { ...(data as OutsideType), month },
            }),
        intern: async () =>
            await prisma.intern.create({ data: data as InternType }),
        competition: async () =>
            await prisma.competition.create({
                data: {
                    ...(data as CompetitionType),
                    scale: +(data as CompetitionType).scale,
                },
            }),
    };

    return result[path]();
};

export const languageType = (path: string) => {
    let url = 'https://www.toeicswt.co.kr/receipt/examSchList.php';
    let pathType = 'tbody > tr';
    let dataObj: languageDetail = {
        turn: '',
        Dday: '',
        resultDay: '',
        applicationPeriod: '',
    };

    switch (path) {
        case 'toeic':
            url = 'https://exam.toeic.co.kr/receipt/examSchList.php';
            break;
        case 'toeicBR':
            url = 'https://www.toeicbridge.co.kr/receipt/examSchList.php';
            dataObj = { Dday: '', resultDay: '', applicationPeriod: '' };
            break;
        case 'toeicSW':
            pathType = 'tr.speakingwriting';
            dataObj = { Dday: '', resultDay: '', applicationPeriod: '' };
            break;
        case 'toeicWT':
            pathType = 'tr.writing';
            dataObj = { Dday: '', resultDay: '', applicationPeriod: '' };
            break;
        case 'toeicST':
            dataObj = { Dday: '', resultDay: '', applicationPeriod: '' };
            break;
        case 'ch':
            url = 'https://www.ybmtsc.co.kr/receipt/examSchList.php';
            break;
        case 'jp':
            url = 'https://www.jpt.co.kr/receipt/examSchList.php';
            break;
        case 'jpSP':
            url = 'https://www.ybmsjpt.co.kr/receipt/examSchList.php';
            break;
        default:
            break;
    }

    return { url, pathType, dataObj };
};

export const createLanguageData = async ({
    path,
    homePage,
    dataObj,
}: languagePath): Promise<Language> => {
    return await prisma.language.create({
        data: { path, homePage, ...dataObj },
    });
};

export const examScheduleObj = {
    turn: '',
    wtReceipt: '',
    wtDday: '',
    wtResultDay: '',
    ptReceipt: '',
    ptDday: '',
    resultDay: '',
};

const findSubCategory = async (
    keyword: string,
): Promise<SubCategory | null> => {
    return await prisma.subCategory.findUnique({
        where: { keyword },
    });
};

export const createMainCategory = async (
    mainKeyword: string,
    subKeyword: string,
): Promise<SubCategory> => {
    let mainCategory;

    try {
        mainCategory = await prisma.mainCategory.create({
            data: {
                keyword: mainKeyword,
            },
        });
    } catch (error) {
        mainCategory = await prisma.mainCategory.findUnique({
            where: { keyword: mainKeyword },
        });
    }

    let subCategory;

    try {
        subCategory = await prisma.subCategory.create({
            data: {
                keyword: subKeyword,
                mainCategoryId: mainCategory!.id,
            },
        });
    } catch (error) {
        subCategory = await findSubCategory(subKeyword);
    }

    return subCategory!;
};

export const createQNetData = async ({
    data,
    mdobligFldNm: keyword,
}: createQNet): Promise<QNet> => {
    const subCategory = await findSubCategory(keyword);

    return await prisma.qNet.create({
        data: {
            ...data,
            examSchedules: {
                createMany: {
                    data: data.examSchedules,
                },
            },
            subCategoryId: subCategory!.id,
        },
    });
};
