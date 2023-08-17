import passport, { Profile } from 'passport';
import {
    Strategy as KakaoStrategy,
    StrategyOption,
} from 'passport-kakao';

const registerKakaoStrategy = () => {
    passport.use(
        new KakaoStrategy(
            {
                clientID: process.env.KAKAO_CLIENT_ID,
                callbackURL: 'http://localhost:4000/login/kakao',
            } as StrategyOption,
            async (
                accessToken: string,
                refreshToken: string,
                profile: Profile,
                done,
            ) => {
                console.log(accessToken, refreshToken, profile);
                done(accessToken, refreshToken, profile);
            },
        ),
    );
};

export default registerKakaoStrategy;
