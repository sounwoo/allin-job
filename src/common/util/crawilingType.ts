import prisma from '../../database/prismaConfig';
import {
    OutsideType,
    InternType,
    CompetitionType,
} from '../crawiling/interface';

export const crawilingType = (path: string, i: number) => {
    let url, dataType, detailClass, mainImageType;

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
            };
            detailClass = 'jss6';
            mainImageType = 'card-image';
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
                Scale: '',
                applicationPeriod: '',
                homePage: '',
                benefits: '',
                preferentialTreatment: '',
            };
            detailClass = 'jss6';
            mainImageType = 'card-image';
            break;
    }

    return { url, dataType, detailClass, mainImageType };
};

export const createCrawilingData = async <T extends object>(
    data: T,
    path: string,
) => {
    let result;
    console.log(data);
    switch (path) {
        case 'outside':
            result = await prisma.outside.create({
                data: {
                    ...(data as OutsideType),
                },
            });
            break;

        case 'intern':
            result = await prisma.intern.create({
                data: {
                    ...(data as InternType),
                },
            });
            break;

        default:
            result = await prisma.competition.create({
                data: {
                    ...(data as CompetitionType),
                },
            });
    }
    return result;
};
