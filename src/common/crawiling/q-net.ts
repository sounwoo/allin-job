import axios from 'axios';

const qqq = async () => {
    const result = await axios.get(
        'http://openapi.q-net.or.kr/api/service/rest/InquiryListNationalQualifcationSVC/getList?serviceKey=RnSZD%2FGHF90r8mHgJ6f6qfZqqoezFPFzaUCfU1laEUh%2By%2B7tOqW8GF%2FUNXF15G21YWnKB7woJzLff4MwcLLYow%3D%3D',
    );

    // 'http://apis.data.go.kr/B490007/qualExamSchd/getQualExamSchdList?dataFormat=json&serviceKey=RnSZD%2FGHF90r8mHgJ6f6qfZqqoezFPFzaUCfU1laEUh%2By%2B7tOqW8GF%2FUNXF15G21YWnKB7woJzLff4MwcLLYow%3D%3D&implYy=2023&numOfRows=10&pageNo=1&jmCd=7910&qualgbCd=T',
    console.log(result.data);
};

qqq();

// http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getFeeList

// 수수료
// http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getJMList
