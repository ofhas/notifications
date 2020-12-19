import express from 'express';
import store from './store';
import { RequestWithCtx, Context } from '../../libs/types';
import logging from '../../libs/logging';
import { Message } from '../../types/Message';
import { FailedResponse, routeWrapper, Response, SuccessResponse, RouteHandler } from '../utils';

const router = express.Router();

const getChannelMsgs: RouteHandler = async (
  req: RequestWithCtx
)=> {
  const { user } = req.authContext;
  const { organization } = user;
  const { channel = '' } = req?.query;
  return store
    .getChannelsMsgs(channel.toString(), organization)
    .then((docs) => new SuccessResponse(docs.map((doc) => doc._doc)))
    .catch((e) => {
      logging.getLogger().error('Error while getting msgs to user', user, channel, e);
      return new FailedResponse(e)
    });
};
router.get('/channels/msgs', routeWrapper(getChannelMsgs));

export default router;
