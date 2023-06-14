import * as OpenAI from 'openai'
import dedent from 'ts-dedent'
import config from './config'

const conf = new OpenAI.Configuration({
  apiKey: config.openai.apiKey,
})

const openai = new OpenAI.OpenAIApi(conf)

export class ChatBot {
  protected userId?: string
  protected temperature = 0.5

  constructor() {}

  setUserId(userId: string) {
    this.userId = userId
  }

  _getSharedArgs() {
    return {
      model: 'gpt-4',
      temperature: this.temperature,
      n: 1,
      max_tokens: 1024,
      user: this.userId,
    }
  }

  async determineIntent(text: string) {
    const res = await openai.createChatCompletion({
      ...this._getSharedArgs(),
      messages: [
        {
          role: 'system',
          content: dedent`
          你是一个自然语言处理机器人。你需要识别一段文本。并解析用户希望执行的指令。支持的指令包括：

          1. 总结对话

          如果你识别出了用户的指令。那么回复：“识别到指令：{序号}”。如：用户发送：“总结一下群里之前的对话”。此时你识别到用户的指令是“总结对话”。那么你需要回复：“识别到指令：1”。当你没有识别到任何可用的指令时，你则作为一个助手机器人，你可以根据你所知道的知识给出对应的回答。
          `.trim(),
        },
        {
          role: 'user',
          content: text,
        },
      ],
    })
    return res.data.choices[0].message?.content
  }

  async summaryConversion(text: string) {
    const res = await openai.createChatCompletion({
      ...this._getSharedArgs(),
      messages: [
        {
          role: 'system',
          content: dedent`
        你是一个助手机器人。你的功能是总结发给你的对话信息。方括号内的是消息发出的时间。冒号前的是发送人的名字。冒号之后是消息的内容。
        你需要以有序列表的形式提炼出对话锁讨论的论题。并且如果对话产生了结论或者代办事项则在后面给出。你不需要给出会话的时间。请记住使用有序列表。不要将所有信息放在同一行内。尽可能表述的清晰，简练。
        `.trim(),
        },
        {
          role: 'user',
          content: text,
        },
      ],
    })

    return res.data.choices[0].message?.content
  }
}
