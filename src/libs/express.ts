import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import winston from 'winston';
import morgan from 'morgan';
import { Authenticator } from 'passport';
import loginRouter, {
  loginRoute,
} from '../modules/authentication/router';
import channelsRouter from '../modules/channels/router';
import msgsRouter from '../modules/messages/router';
import usersRouter from '../modules/users/router';
import auth, {
  jwtAuthMiddleware,
} from '../modules/authentication/authentication';
import { FailedResponse, routeWrapper } from '../modules/utils';
import { RequestWithCtx } from './types';
import { onErrorResumeNext } from 'rxjs';

export default (logger: winston.Logger, passport: Authenticator) => {
  const app: express.Express = express();
  app.use(
    cors({
      credentials: true,
      exposedHeaders: ['set-cookie'],
      origin: [
        'localhost:9000',
        'http://localhost:9000',
        'localhost',
        /.*localhost.*/,
      ],
    })
  );
  app.use(morgan('combined'));
  app.get('/health', (req, res) => res.send());
  app.use(express.json());
  app.use(passport.initialize());
  app.use('/login', auth.basicAuth, loginRouter);
  app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );
  app.get(
    '/auth/google/callback',
    (req, res, next) => {
      next();
    },
    passport.authenticate('google', { failureRedirect: '/login-fucner' }),
    (req, res, next) => {
      loginRoute(req as RequestWithCtx, res)
        .then((r) => res.redirect('/'))
        .catch((e) => next(e));
    }
  );
  app.use(cookieParser());
  app.use((req, res, next) => jwtAuthMiddleware(req, next));
  app.use('/auth', (req, res) => {
    const withCtx = req as RequestWithCtx;
    res.send({ ...withCtx.authContext, accessToken: withCtx.token });
  });
  app.use('/logout', (req, res) =>
    res.cookie('access_token', '').redirect('/')
  );
  app.use(channelsRouter);
  app.use(msgsRouter);
  app.use(usersRouter);
  app.use(
    (
      error: FailedResponse & { message?: string },
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      logger.error(error.message || 'Uncought exception.', { ...error });
      const body = {
        ...error,
        errors: (error.errors || []).map((e) => e.message),
      };
      res.status(error.status || 500).send(body);
    }
  );
  app.use((_, res) => res.status(404).send());
  return app;
};
