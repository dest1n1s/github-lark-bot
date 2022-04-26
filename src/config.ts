export default {
  port: parseInt(process.env.GLB_PORT),
  username: process.env.GLB_USERNAME,
  personalAccessToken: process.env.GLB_PERSONAL_ACCESS_TOKEN,
  baseUrl: process.env.GLB_BASE_URL,
  appID: process.env.GLB_APP_ID,
  appSecret: process.env.GLB_APP_SECRET,
  botOpenId: process.env.GLB_BOT_OPEN_ID
}
