import passport, { Profile } from 'passport';
import { Strategy as NaverStrategy, StrategyOption } from 'passport-naver';
import { url } from '../../../common/util/callbackUrl';

const registerNaverStrategy = () => {
    passport.use(
        new NaverStrategy(
            {
                clientID: process.env.NAVER_CLIENT_ID,
                clientSecret: process.env.NAVER_CLIENT_SECRET,
                callbackURL: `${url().domain}login/naver/callback`,
            } as StrategyOption,
            (_: string, __: string, profile: Profile, done) => {
                try {
                    done(null, {
                        email: profile.emails![0].value,
                        provider: profile.provider,
                    });
                } catch (error) {
                    done(error);
                }
            },
        ),
    );
};

export default registerNaverStrategy;
