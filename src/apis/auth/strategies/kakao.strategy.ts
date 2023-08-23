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
                clientSecret: process.env.KAKAO_CLIENT_SEVRET,
                callbackURL:
                    'http://localhost:4000/login/kakao/callback',
            } as StrategyOption,
            async (
                accessToken: string,
                refreshToken: string,
                profile: Profile,
                done,
            ) => {
                try {
                    const user = {
                        accessToken,
                        refreshToken,
                        profile,
                    };
                    done(null, user);
                } catch (error) {
                    console.error(error);
                    done(error);
                }
            },
        ),
    );
};

export default registerKakaoStrategy;
