import passport, { Profile } from 'passport';
import {
    Strategy as GoogleStrategy,
    _StrategyOptionsBase,
} from 'passport-google-oauth20';

const registerGoogleStrategy = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL:
                    'http://localhost:4000/login/google/callback',
            } as _StrategyOptionsBase,
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
                } catch (error: any) {
                    console.error(error);
                    done(error);
                }
            },
        ),
    );
};

export default registerGoogleStrategy;
