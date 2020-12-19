import express from 'express'
import jwt from 'jsonwebtoken'
import { RequestWithCtx, Context } from '../../libs/types'
import logging from '../../libs/logging'
import { getConfig } from '../../libs/config'
import { RouteHandler, routeWrapper, SuccessResponse } from '../utils'
import crypto from './crypto'

const router = express.Router()

const signJwt = (context: Context) => new Promise<string>((resolve, reject) => {
    const jwtConfig = getConfig().jwt
    const callback: jwt.SignCallback = (err, encoded) => err === null ? resolve(encoded as string) : reject(err)
    jwt.sign(context,
        jwtConfig.secret,
        { algorithm: 'HS256' },
        callback)
}).then(crypto.encrypt)


export const loginRoute: RouteHandler = async (req: RequestWithCtx, res: express.Response) => {
    const context: Context = req.authContext
    return signJwt(context)
        .then(accessToken => res.cookie('access_token', accessToken) &&
            new SuccessResponse({ accessToken, user: context.user }))
}
export const wraapedLoginRoute = routeWrapper(loginRoute)
router.post('/', wraapedLoginRoute)

export default router;