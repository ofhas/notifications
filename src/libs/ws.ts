import winston from 'winston';
import express from 'express';
import * as http from 'http';
import Primus from 'primus';
import auth from '../modules/authentication/authentication';
import { handleClient } from '../logic/gateway';

interface PrimusConfig {
  pathname: string;
}

interface Config {
  primus: PrimusConfig;
}

export default (
  logger: winston.Logger,
  server: http.Server,
  config: Config
) => {
  const primus = new Primus(server, config.primus);
  primus.authorize(async (req, done) => {
    auth.jwtAuthMiddleware(
      req as express.Request,
      done as express.NextFunction
    );
  });
  primus.on('connection', handleClient);

  return primus;
};
