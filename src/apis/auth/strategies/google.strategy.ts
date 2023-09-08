import passport, { Profile } from 'passport';
import {
    Strategy as GoogleStrategy,
    _StrategyOptionsBase,
} from 'passport-google-oauth20';
import { url } from '../../../common/util/callbackUrl';

const registerGoogleStrategy = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${url.local}login/google/callback`,
            } as _StrategyOptionsBase,
            (_: string, __: string, profile: Profile, done) => {
                try {
                    done(null, {
                        email: profile.emails![0].value,
                        provider: profile.provider,
                    });
                } catch (error: any) {
                    done(error);
                }
            },
        ),
    );
};

export default registerGoogleStrategy;
