import _ from 'lodash'
import { ChatBot } from './chatgpt'
import { lark } from './lark'
import { ImMessageReceiveV1Data } from './type'
import { attemptParseJSON } from './util/json'
import { p } from './util/promise'

export class MessageReceiveHandler {
  chatBot = new ChatBot()

  constructor(protected data: ImMessageReceiveV1Data) {}

  async _reply(content: string) {
    await lark.im.message.reply({
      data: {
        content: JSON.stringify({
          text: content,
        }),
        msg_type: 'text',
      },
      path: {
        message_id: this.data.message.message_id,
      },
    })
  }

  async _parseInputText() {
    if (this.data.message.message_type !== 'text') return
    if (this.data.message.chat_type === 'group') {
      if (!this.data.message.mentions?.some(i => i.name === 'bard')) return
    }
    const content = attemptParseJSON(this.data.message.content)
    return content.text
  }

  async _handleIntent(message: string) {
    const userId = this.data.sender?.sender_id?.open_id
    if (userId) this.chatBot.setUserId(userId)

    const content = await this.chatBot.determineIntent(message)
    if (!content) return
    if (content.startsWith('识别到指令')) {
      const cmdId = content.split('：').pop()
      if (cmdId === '1') {
        return this._summaryConversion()
      }
    }
    return this._reply(content)
  }

  async _getRecentConversion(groupId: string) {
    const res = await lark.im.message.list({
      params: {
        container_id_type: 'chat',
        container_id: groupId,
        sort_type: 'ByCreateTimeDesc',
        page_size: 50,
      } as any,
    })
    const items = res.data?.items?.filter(item => {
      return (
        item.sender?.sender_type === 'user' &&
        item.msg_type === 'text' &&
        !item.mentions?.some(i => i.name === 'bard')
      )
    })
    if (!items) return

    const userIds = _.uniq(_.compact(items.map(item => item.sender?.id)))
    const users = await p(userIds)
      .map(async userId => {
        const res = await lark.contact.user.get({
          path: {
            user_id: userId,
          },
        })
        return res.data?.user
      })
      .then(users => _.compact(users))
      .then(users => {
        return _.keyBy(users, 'open_id')
      })

    return items
      .slice()
      .reverse()
      .map(item => {
        if (!item.sender?.id) return
        const user = users[item.sender.id]
        if (!user) return
        if (!item.create_time) return
        const text = attemptParseJSON(item.body?.content)?.text
        if (!text) return
        return `[${new Date(+item.create_time).toISOString()}] ${
          user.name
        }: ${text}`
      })
      .join('\n')
  }

  async _summaryConversion() {
    if (this.data.message.chat_type !== 'group') {
      return this._reply('这个功能只能在群里使用')
    }
    const groupId = this.data.message.chat_id

    const messages = await this._getRecentConversion(groupId)

    if (!messages) return this._reply('无法获取消息记录')

    const result = await this.chatBot.summaryConversion(messages)

    if (!result) return

    await this._reply(result)
  }

  async handle() {
    const input = await this._parseInputText()
    if (!input) return
    await this._handleIntent(input)
  }
}
