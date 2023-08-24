import axios from 'axios';
import cheerio from 'cheerio';

const competition = async () => {
    // !전체게시물 상세페이지 조회 -> 상세페이지 크롤링 구분
    // const length = new Array(3).fill(0);

    // const ids = await Promise.all(
    //     length.map(async (_, i) => {
    //         const qqq = await axios.get(
    //             `https://api.linkareer.com/graphql?operationName=ActivityList_Activities&variables=%7B%22filterBy%22%3A%7B%22status%22%3A%22OPEN%22%2C%22activityTypeID%22%3A%221%22%7D%2C%22pageSize%22%3A20%2C%22page%22%3A${
    //                 i + 1
    //             }%2C%22activityOrder%22%3A%7B%22field%22%3A%22CREATED_AT%22%2C%22direction%22%3A%22DESC%22%7D%2C%22withManager%22%3Atrue%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%228825f82938c33738717c30842b55557c56990f963907c69bac8e9d19ea484359%22%7D%7D`,
    //         );

    //         return qqq.data.data.activities.nodes.filter(
    //             (el: any) => el.id,
    //         );
    //     }),
    // );
    // console.log(ids);
    // ids.forEach(async (el) => {
    //     const result = await axios.get(`https://linkareer.com/activity/${el}`);
    //     const $ = cheerio.load(result.data);
    // });

    // !상세페이지 크롤링 -> ids.forEach구문에 적용해서 데이터 베이스 넣을 예정
    const result = await axios.get(
        `https://linkareer.com/activity/138494`,
    );
    const $ = cheerio.load(result.data);
    const Dday = $('.recruitText').text();
    const title = $('h2.title').text();
    const view = $('span.count').html();
    const mainImage = $('img.card-image').attr('src');
    const corporateForm = $('h3.jss6').html();
    console.log(Dday, title, view);
    console.log(mainImage);
    console.log(corporateForm);
};

competition();
