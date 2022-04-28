import 'reflect-metadata'
import express from 'nanoexpress'
import { camelizeKeys } from './utils'
import { handle } from './github/handler'
import { i18nInit } from './i18n/i18n.config'

import NodeMonkey from 'node-monkey'
import decrypt from './decrypt'
import lark from './lark'
import larkManager from './lark/handler'
import config from './config'
import dataSource from './database/data-source'

const main = async () => {
  NodeMonkey()

  console.log(process.env)
  console.log(process.version)

  await dataSource.initialize()

  const app = express()

  await i18nInit()

  // try {
  //   await github.createGithubWebhook('https://api.github.com/repos/dest1n1s/TestHook/hooks')
  // } catch (e) {
  //   console.log(e.response)
  // }

  await lark.refreshToken()

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.post('/github', async (req, res) => {
    const body = camelizeKeys(JSON.parse(req.body.toString()))
    console.log(req.headers)
    const resData = handle(req.headers['x-github-event'], body)
    console.log(body)
    console.log(resData)
    if (resData) {
      const repo = body.repository.fullName
      const chats = await larkManager.getChats(repo)
      console.log('Chats: ', chats)
      for (const chat of chats) {
        lark
          .sendMessage('chat_id', {
            msgType: 'interactive',
            content: JSON.stringify(resData),
            receiveId: chat.chatId
          })
          .then()
      }
      // await axios.post(
      //   'https://open.feishu.cn/open-apis/bot/v2/hook/f116f8d3-43b8-4f2a-b3c9-23df25001a59',
      //   {
      //     msg_type: 'interactive',
      //     card: resData
      //   }
      // )
    }

    return res.send('Hello World!')
  })

  app.post('/lark', async (req, res) => {
    const encodedBody = JSON.parse(req.body.toString())
    const body = camelizeKeys(decrypt(encodedBody.encrypt))
    console.log(body)
    const response = await larkManager.handle(body)
    return res.send(response)
  })

  await app.listen(config.port)
}

main().then()
