import passport from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';
import winston from 'winston';
import { upsertUserByGoogleId } from '../modules/authentication/authentication';
import { RequestWithCtx } from './types';
import store from '../modules/users/store';
import { User } from 'src/modules/users/types';

passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
export interface PassportConfig {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
}
export default (
  logger: winston.Logger,
  { passport: passportConf }: { passport: PassportConfig }
) =>
  passport.use(
    new OAuth2Strategy(
      { ...passportConf, passReqToCallback: true },
      async (req, accessToken, refreshToken, profile, done) => {
        logger.info('trying to auth google user.', profile);
        upsertUserByGoogleId(
          profile,
          'global',
          'public'
        )
          .then((user) => {
            (req as RequestWithCtx).authContext = { user };
            done(null, user);
          })
          .catch((e) => done(e));
      }
    )
  );
