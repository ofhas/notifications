import * as express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Profile } from 'passport-google-oauth';
import { RequestWithCtx, Context } from '../../libs/types';
import { getConfig } from '../../libs/config';
import { getLogger } from '../../libs/logging';
import UserModel, { UserDoc } from '../users/model';
import logging from '../../libs/logging';
import { User } from '../users/types';
import { FailedResponse } from '../utils';
import { decrypt } from './crypto';
import ChannelModelFact from '../channels/model';

const AUTORIZATION_HEADER = 'Authorization';

export const getAuthToken = (req: express.Request) =>
  ((req.headers[AUTORIZATION_HEADER] as string) || '')
    .replace(/[ ]+/g, ' ')
    .split(' ')[1] ||
  ''.trim() ||
  req.query?.access_token ||
  req?.cookies?.access_token;

const jwtVerify = (encrypted: string) =>
  new Promise<Context>((resolve, reject) =>
    Promise.resolve(encrypted)
      .then(decrypt)
      .then((token) =>
        jwt.verify(token, getConfig().jwt.secret, ((err, body) =>
          err == null
            ? resolve(body as Context)
            : reject(err)) as jwt.VerifyCallback)
      )
  );

export const authByJWT = (token: string) => jwtVerify(token);
export const upsertUserByGoogleId = (
  profile: Profile,
  organization: string,
  publicChannelId: string
) => {
  const user = User.fromGoogleProfile(profile, organization);
  return UserModel.getUsersModel()
    .findOneAndUpdate({ id: profile.id }, user, {
      upsert: true,
    })
    .lean()
    .exec()
    .then(async (doc) => {
      if (!doc) {
        const UserToChannelModel = ChannelModelFact.getUserToChannelSchemaModel(
          organization
        );
        const publicChannel = await ChannelModelFact.getChannelsModel(
          organization
        )
          .findOne({ id: publicChannelId })
          .lean()
          .exec();
        if (publicChannel)
          await new UserToChannelModel({
            channel_id: publicChannel.id,
            user_id: user.id,
          }).save();
      }
      return new User(
        user.name,
        '',
        user.organization,
        user.username,
        user.id,
        user.photo
      );
    });
};
export const jwtAuthMiddleware = (
  req: express.Request,
  next: express.NextFunction
) => {
  const logger = getLogger();

  const token = getAuthToken(req) as string;
  jwtVerify(token)
    .then((ctx) => {
      (req as RequestWithCtx).authContext = ctx;
      (req as RequestWithCtx).token = token;
      next();
    })
    .catch((e) => {
      logger.error("Can't authenticate JWT token", e);
      next({ ...e, status: 401 });
    });
};

export const basicAuth: express.Handler = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(
      new FailedResponse([new Error('username/password are missing.')], 401)
    );
  }

  const user = (await UserModel.getUsersModel()
    .findOne({ username })
    .exec()
    .catch((e) => {
      logging.get().error('Error authenticating user.', username, e);
      next(new FailedResponse([e], 401));
    })) as UserDoc;
  const validatedUser: User = (await bcrypt
    .compare(password, user?._doc?.password || '')
    .then((match) => {
      if (match) {
        return {
          ...(user?._doc as User),
          password: '',
        };
      } else
        throw new FailedResponse(
          [new Error('username/password is incorrect.')],
          401
        );
    })
    .catch((e) => {
      logging.get().error('Error validating password for user.', username, e);
      next(e);
    })) as User;

  (req as RequestWithCtx).authContext = { user: validatedUser };
  return next();
};

export default {
  basicAuth,
  authByJWT,
  upsertUserByGoogleId,
  jwtAuthMiddleware,
};
