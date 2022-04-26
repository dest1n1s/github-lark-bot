import github from '../github'
import lark from './index'
import config from '../config'

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
  repoListener: { [key: string]: string[] } = {}
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
        console.log('RepoListener: ')
        console.log(this.repoListener)
        if (!this.repoListener[repo]) {
          try {
            const response = await github.createGithubWebhook(
              `https://api.github.com/repos/${repo}/hooks`
            )

            this.repoListener[repo] = []
            console.log('Created Github Webhook: ')
            console.log(response)
          } catch (e) {
            console.log({ e })
          }
        }
        this.repoListener[repo].push(message.chatId)
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
