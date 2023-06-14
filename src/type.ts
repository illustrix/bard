import Lark from '@larksuiteoapi/node-sdk'

export type ImMessageReceiveV1Data = Parameters<
  NonNullable<Lark.EventHandles['im.message.receive_v1']>
>[0]
