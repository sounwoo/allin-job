import jwt from 'jsonwebtoken';
import { cookie } from '../../common/types';
import { NextFunction, Request, Response } from 'express';

const refreshGuard = (req: Request, res: Response, next: NextFunction) => {
    const { cookie } = req.headers as cookie;
    const [tokenFormat, refreshToken] = cookie
        ? cookie.replace('=', '= ').split(' ')
        : ['', ''];

    if (tokenFormat !== 'refreshToken=') {
        return res.status(400).send({
            errorMessage: '토큰 형식이 일치하지 않습니다.',
        });
    }
    try {
        const validate = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY!);

        req.user = { id: validate.sub as string };
        next(); // 뒤에오는 콜백함수를 실행시켜줘
    } catch (err) {
        console.log(err);
        res.status(500).send({
            errorMessage: '로그인 후 이용 가능한 기능입니다.',
        });
    }
};

export default refreshGuard;

// next () -> 다음 미들웨어를 실행시켜줘 라는 의미

// 가드 -> 요청이 오면 가드를 통과 하고 , 메서드 쓰잖아?
// next () => 메서드를 실행 시키는거
// next 판단 보류 => next() => 다음 미들웨어를 실행켜서 판단보류
// next (err) => 파라미터 값을 넘기면 무조건 에러야

// app.ts -> 에러 핸들링을 하게되면 (err, req, res ,next ) => err에 next(에러)를 여기서 잡을수 있어

// req => 이미 들어왔어 => 가드를 검사 => req.user.id 만들었어 => 다음 함수실행시켜 => req 전역에서 쓰이기때문에

// req : Req -> 가드에서 값을 넣어줘
// 다음 함수에서 req.user 사용할 수 있는거야
// 미들웨어 중간에서 이거먼전 실행하고 다음꺼 실행시켜

// 함수 () { req.user를만들면 }.then((el) => req.user )
