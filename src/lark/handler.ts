import github from '../github'
import lark from './index'
import config from '../config'
import dataSource from '../database/data-source'
import { ChatModel, HookModel } from '../database/entities'

interface LarkMessage {
  messageId: string
  rootId?: string
  parentId?: string
  createTime: string
  chatId: string
  chatType: 'p2p' | 'group'
  messageType: string
  content: string
  mentions?: {
    key: string
    id: {
      unionId: string
      userId: string
      openId: string
    }
    name: string
    tenantKey: string
  }[]
}

interface LarkMessageEvent {
  sender: {
    senderId: {
      unionId: string
      userId: string
      openId: string
    }
    senderType: string
    tenantKey: string
  }
  message: LarkMessage
}

class LarkManager {
  botOpenId: string
  constructor(botOpenId) {
    this.botOpenId = botOpenId
  }
  async handle(body: any) {
    if (body.challenge) {
      return {
        challenge: body.challenge
      }
    }
    if (body.schema === '2.0' && body.header.eventType === 'im.message.receive_v1')
      await this.handleMessageEvent(body.event)
    return null
  }
  async handleMessageEvent(event: LarkMessageEvent) {
    const message = event.message
    if (
      message.chatType === 'group' &&
      message.mentions &&
      message.mentions.length === 1 &&
      message.mentions[0].id.openId === this.botOpenId &&
      message.messageType === 'text'
    ) {
      const content: { text: string } = JSON.parse(message.content)

      const testSubscribe = async (text: string): Promise<string | null> => {
        const regexResult = /^@_user_1 subscribe (\S+)$/.exec(text)
        if (!regexResult) return null
        const repoRegexResult = /^([\w-+#]+\/[\w-+#]+)\/*$/.exec(regexResult[1])
        if (!repoRegexResult) return 'Invalid repository value!'
        const repo = repoRegexResult[1]
        let hook = await dataSource.getRepository(HookModel).findOne({
          where: {
            repo
          },
          relations: {
            chats: true
          }
        })
        if (!hook) {
          try {
            const response = await github.createGithubWebhook(
              `https://api.github.com/repos/${repo}/hooks`
            )

            hook = new HookModel(repo, [])
            await dataSource.manager.save(hook)
            console.log('Created Github Webhook: ')
            console.log(response)
          } catch (e) {
            console.log(e.response)
            if (e.response.status === 422) {
              hook = new HookModel(repo, [])
              await dataSource.manager.save(hook)
            } else {
              return `Subscription failed with ${e.response.status}!`
            }
          }
        }
        if (hook.chats.find((v) => v.chatId === message.chatId)) return 'Already subscribed!'
        const chat = new ChatModel(message.chatId)
        await dataSource.manager.save(chat)
        hook.chats.push(chat)
        await dataSource.manager.save(hook)
        return 'Successfully subscribed!'
      }
      const tests = [testSubscribe]
      for (const test of tests) {
        const res = await test(content.text)
        if (res) {
          return await lark.replyMessage(message.messageId, {
            content: JSON.stringify({ text: res }),
            msgType: 'text'
          })
        }
      }
    }
    return null
  }
}

export default new LarkManager(config.botOpenId)
