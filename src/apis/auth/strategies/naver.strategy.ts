import passport, { Profile } from 'passport';
import {
    Strategy as NaverStrategy,
    StrategyOption,
} from 'passport-naver';

const registerNaverStrategy = () => {
    passport.use(
        new NaverStrategy(
            {
                clientID: process.env.NAVER_CLIENT_ID,
                clientSecret: process.env.NAVER_CLIENT_SECRET,
                callbackURL:
                    'http://localhost:4000/login/naver/callback',
            } as StrategyOption,
            async (
                accessToken: string,
                refreshToken: string,
                profile: Profile,
                done,
            ) => {
                try {
                    const user = {
                        email: profile.emails![0].value,
                        provider: profile.provider,
                    };
                    done(null, {
                        email: user.email,
                        provider: user.provider,
                    });
                } catch (error) {
                    console.error(error);
                    done(error);
                }
            },
        ),
    );
};

export default registerNaverStrategy;
