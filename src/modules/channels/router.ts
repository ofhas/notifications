import express from 'express'
import { Context, RequestWithCtx } from '../../libs/types'
import { RouteHandler, routeWrapper, Response, SuccessResponse } from '../../modules/utils'
import store from './store'
import { Channel } from './types'

const router = express.Router()

const getUserChannels: RouteHandler = (req: RequestWithCtx) => {
    const { user }: Context = req.authContext
    return store
        .getChannelsForUser(user, user.organization)
        .then(res => new SuccessResponse(res))
}

type PostChannelsReq = { channel: Channel, users: string[] }
const postChannels: RouteHandler = (req: RequestWithCtx) => {
    const { user }: Context = req.authContext
    const { channel, users }: PostChannelsReq = req.body

    return store
        .createChannel(channel, user.organization, users || [])
        .then(res => new SuccessResponse(res))
}

router.get('/channels', routeWrapper(getUserChannels))
router.post('/channels', routeWrapper(postChannels))

export default router;