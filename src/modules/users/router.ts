import express from 'express';
import store from './store';
import { RequestWithCtx, Context } from '../../libs/types';
import logging from '../../libs/logging';
import { FailedResponse, routeWrapper, Response, SuccessResponse, RouteHandler } from '../utils';

const router = express.Router();

const getUser: RouteHandler = async (
  req: RequestWithCtx
)=> {
  const { user } = req.authContext;
  const { organization } = user;
  return store
    .getUsersForOrg(organization)
    .then((docs) => new SuccessResponse(docs))
    .catch((e) => {
      logging.getLogger().error('Error while getting users for org', user, e);
      return new FailedResponse(e)
    });
};
router.get('/users', routeWrapper(getUser));

export default router;
