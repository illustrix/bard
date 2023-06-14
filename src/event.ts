import * as Lark from '@larksuiteoapi/node-sdk'
import config from './config'
import { MessageReceiveHandler } from './handler'

const eventDispatcher = new Lark.EventDispatcher({
  encryptKey: config.lark.encryptKey,
  verificationToken: config.lark.verificationToken,
})

export const larkEventHandler = Lark.adaptKoa(
  '/webhook/lark',
  eventDispatcher,
  {
    logger: console,
    autoChallenge: true,
  },
)

eventDispatcher.register({
  'im.message.receive_v1': data => {
    new MessageReceiveHandler(data).handle()
  },
})
