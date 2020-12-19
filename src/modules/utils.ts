import * as express from 'express';
import { RequestWithCtx } from 'src/libs/types';
import { getLogger } from '../libs/logging';

export interface Response {
  success: boolean;
  status: number;
}

export class SuccessResponse<T> implements Response {
  success: boolean = true;
  data: T;
  status: number;
  constructor(data: T, status: number = 200) {
    this.data = data;
    this.status = status;
  }
}

export class FailedResponse implements Response {
  success: boolean = false;
  errors: Error[];
  status: number;
  constructor(errors: Error[], status: number = 500) {
    this.errors = errors;
    this.status = status;
  }
}

export type RouteHandler = (
  req: RequestWithCtx,
  res?: express.Response,
  next?: express.NextFunction
) => Promise<Response>;

export const routeWrapper = (
  handler: RouteHandler
): express.RequestHandler => async (req, res, next) =>
  handler(req as RequestWithCtx, res, next)
    .then((result: object) => res.send(result))
    .catch((e: FailedResponse) => {
      getLogger().error(`Error in route.`, e);
      res.status(e.status || 500).send(e || 'Internal Server Error');
    });

function isObject(obj: any) {
  return obj === Object(obj);
}

export const toDotNotation = (value: any, prefix: string = ''): object => {
  if (isObject(value))
    return Object.entries(value as object).reduce(
      (dotNotationObject, [key, jsValue]) => {
        return {
          ...dotNotationObject,
          ...toDotNotation(jsValue, `${prefix && prefix + '.'}${key}`),
        };
      },
      {}
    );

  return { [prefix]: value };
};
