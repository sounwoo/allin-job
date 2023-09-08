import passport from 'passport';
import { Strategy as KakaoStrategy, StrategyOption } from 'passport-kakao';
import { url } from '../../../common/util/callbackUrl';

const registerKakaoStrategy = () => {
    passport.use(
        new KakaoStrategy(
            {
                clientID: process.env.KAKAO_CLIENT_ID,
                clientSecret: process.env.KAKAO_CLIENT_SEVRET,
                callbackURL: `${url.local}login/kakao/callback`,
            } as StrategyOption,
            (_: string, __: string, profile, done) => {
                try {
                    done(null, {
                        email: profile._json.kakao_account.email,
                        provider: profile.provider,
                    });
                } catch (error) {
                    done(error);
                }
            },
        ),
    );
};

export default registerKakaoStrategy;
