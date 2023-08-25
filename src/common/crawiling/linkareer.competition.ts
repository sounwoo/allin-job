import axios from 'axios';
import cheerio from 'cheerio';
import prisma from '../../database/prismaConfig';

interface organizationType {
    enterprise: string;
    target: string;
    applicationPeriod: string;
    participationPeriod: string;
    personnel: string;
    region: string;
    preferentialTreatment: string;
    homePage: string;
}

export const competition = async () => {
    const length = new Array(3).fill(0);

    length.map(async (_, i) => {
        const qqq = await axios.get(
            `https://api.linkareer.com/graphql?operationName=ActivityList_Activities&variables=%7B%22filterBy%22%3A%7B%22status%22%3A%22OPEN%22%2C%22activityTypeID%22%3A%221%22%7D%2C%22pageSize%22%3A20%2C%22page%22%3A${
                i + 1
            }%2C%22activityOrder%22%3A%7B%22field%22%3A%22CREATED_AT%22%2C%22direction%22%3A%22DESC%22%7D%2C%22withManager%22%3Atrue%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%228825f82938c33738717c30842b55557c56990f963907c69bac8e9d19ea484359%22%7D%7D`,
        );

        return qqq.data.data.activities.nodes
            .map((el: any) => el.id)
            .forEach(async (el: string) => {
                const result = await axios.get(
                    `https://linkareer.com/activity/${el}`,
                );
                const $ = cheerio.load(result.data);
                const Dday = $('.recruitText').text();
                const title = $('h2.title').text();
                const view = String($('span.count').html()) ?? '0';
                const mainImage =
                    $('img.card-image').attr('src') ?? '';
                const organization = $('h2.organization-name').text();
                const organizationObj: organizationType = {
                    enterprise: '',
                    target: '',
                    applicationPeriod: '',
                    participationPeriod: '',
                    personnel: '',
                    region: '',
                    preferentialTreatment: '',
                    homePage: '',
                };

                $('h3.jss6').each((index, el) => {
                    if (index < 8) {
                        const key =
                            Object.keys(organizationObj)[index];
                        organizationObj[
                            key as keyof typeof organizationObj
                        ] = $(el).text();
                    }
                });
                const detail =
                    $(
                        'div.ActivityDetailTabContent__StyledWrapper-sc-5db6cf4b-0.bDYgjm',
                    ).html() ?? '없음';
                return await prisma.competition.create({
                    data: {
                        Dday,
                        title,
                        view,
                        mainImage,
                        organization,
                        ...organizationObj,
                        detail,
                    },
                });
            });
    });
};
