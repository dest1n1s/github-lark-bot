import axios from 'axios'
import { camelizeKeys, snakifyKeys } from '../utils'
import config from '../config'

export class LarkApi {
  appID: string
  appSecret: string
  tenantAccessToken: string | null = null
  constructor(appID: string, appSecret: string) {
    this.appID = appID
    this.appSecret = appSecret
  }
  async refreshToken() {
    const response = await axios.post(
      'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
      {
        app_id: this.appID,
        app_secret: this.appSecret
      }
    )
    const data: { code: number; msg: string; tenantAccessToken: string; expire: number } =
      camelizeKeys(response.data)
    this.tenantAccessToken = data.tenantAccessToken
    console.log('Refreshed Tenant access token: ' + this.tenantAccessToken)
    return data
  }
  async replyMessage(replyMessageId: string, message: { content: string; msgType: string }) {
    const response = await axios.post(
      `https://open.feishu.cn/open-apis/im/v1/messages/${replyMessageId}/reply`,
      snakifyKeys(message),
      {
        headers: {
          Authorization: 'Bearer ' + this.tenantAccessToken
        }
      }
    )
    const data = camelizeKeys(response)
    console.log(data)
    return data
  }
  async sendMessage(
    receiveIdType: string,
    message: { receiveId: string; content: string; msgType: string }
  ) {
    const response = await axios.post(
      'https://open.feishu.cn/open-apis/im/v1/messages',
      snakifyKeys(message),
      {
        headers: {
          Authorization: 'Bearer ' + this.tenantAccessToken
        },
        params: {
          receive_id_type: receiveIdType
        }
      }
    )
    const data = camelizeKeys(response)
    console.log(data)
    return data
  }
}

export default new LarkApi(config.appID, config.appSecret)
