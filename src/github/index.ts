import axios from 'axios'
import config from '../config'

export class GithubManager {
  username: string
  personalAccessToken: string
  webHookBaseUrl: string
  constructor(username: string, personalAccessToken: string, webhookBaseUrl: string) {
    this.username = username
    this.personalAccessToken = personalAccessToken
    this.webHookBaseUrl = webhookBaseUrl
  }

  get auth() {
    return {
      username: this.username,
      password: this.personalAccessToken
    }
  }

  async createGithubWebhook(url: string) {
    const response = await axios.post(
      url,
      {
        name: 'web',
        active: true,
        events: ['push', 'pull_request', 'issues'],
        config: {
          url: this.webHookBaseUrl + '/github',
          content_type: 'json',
          insecure_ssl: '0'
        }
      },
      {
        auth: this.auth,
        headers: {
          Accept: 'application/json'
        }
      }
    )

    console.log(response.data)
  }
}

export default new GithubManager(config.username, config.personalAccessToken, config.baseUrl)
