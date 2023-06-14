import * as Lark from '@larksuiteoapi/node-sdk'
import config from './config'

export const lark = new Lark.Client({
  appId: config.lark.appId,
  appSecret: config.lark.appSecret,
  appType: Lark.AppType.SelfBuild,
  domain: Lark.Domain.Lark,
})
