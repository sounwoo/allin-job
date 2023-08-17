import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { Controllers } from './apis/index';
import passport from 'passport';
import kakao from './apis/auth/strategies/kakao.strategy';
import google from './apis/auth/strategies/google.strategy';
import naver from './apis/auth/strategies/naver.strategy';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 라우터 연결
Controllers.map((contoller) => {
    app.use(contoller.path, contoller.router);
});

// passport 초기화
app.use(passport.initialize());

// Strategy 모듈 실행하여 passport에 등록
// 앱에서 소셜 로그인을 사용할 수 있는 상태를 설정하는 것.
kakao();
google();
naver();

app.get('/', (_, res) => {
    res.send('안녕');
});

app.listen(process.env.PORT, () => {
    console.log('🐶🐶🐶🐶🐶백엔드 오픈🐶🐶🐶🐶🐶', process.env.PORT);
});
