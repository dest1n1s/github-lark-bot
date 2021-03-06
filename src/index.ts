import 'reflect-metadata'
import express from 'express'
import { camelizeKeys } from './utils'
import { handle } from './github/handler'
import { i18nInit } from './i18n/i18n.config'

import NodeMonkey from 'node-monkey'
import decrypt from './decrypt'
import lark from './lark'
import larkManager from './lark/handler'
import config from './config'
import dataSource from './database/data-source'
import bodyParser from 'body-parser'

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

  app.use(bodyParser.json())

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.post('/github', async (req, res) => {
    console.log(req.body)
    const body = camelizeKeys(req.body)
    console.log(req.headers)
    const resData = handle(req.get('x-github-event'), body)
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
    console.log(req.body)
    const encodedBody = req.body
    const body = camelizeKeys(decrypt(encodedBody.encrypt))
    console.log(body)
    const response = await larkManager.handle(body)
    return res.send(response)
  })

  await app.listen(config.port)
}

const mainLoop = async () => {
  try {
    await main()
  } catch (e) {
    console.log(e)
    console.log('Restart after 60 seconds...')
    setTimeout(mainLoop, 60000)
  }
}

mainLoop().then()
