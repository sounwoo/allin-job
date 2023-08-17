import express from 'express';
import 'dotenv/config';
import cors from 'cors';
// import { Controllers } from './apis/index';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 라우터 연결
// Controllers.map((contoller) => {
//     app.use(contoller.path, contoller.router);
// });

app.get('/', (_, res) => {
    res.send('안녕');
});

app.listen(process.env.PORT, () => {
    console.log('🐶🐶🐶🐶🐶백엔드 오픈🐶🐶🐶🐶🐶', process.env.PORT);
});
