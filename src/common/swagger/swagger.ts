import swaggerAutogen from 'swagger-autogen';

const options = {
    info: {
        version: '1.0.0',
        title: 'allinjob API Docs',
        description: '올인잡 api 문서입니다',
    },
    servers: [
        { url: 'http://localhost:4000' },
        { url: 'https://allinjob.co.kr' },
    ],
    schemes: ['http', 'https'],
    tags: [
        {
            name: 'Health',
            description: 'health 체크',
        },
        {
            name: 'Users',
            description: 'User관련 API',
        },
        {
            name: 'SMS',
            description: 'SMS관련 API',
        },
    ],
};

const outputFile = '../common/swagger-output.json';
const endpointsFiles = ['./src/apis/users/users.controller.ts'];
swaggerAutogen(outputFile, endpointsFiles, options);
