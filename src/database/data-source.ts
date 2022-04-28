import { DataSource } from 'typeorm'
import { ChatModel, HookModel } from './entities'
import config from '../config'

export default new DataSource({
  type: 'mysql',
  host: 'github-lark-bot-database',
  port: 3306,
  username: 'root',
  password: config.databaseRootPassword,
  database: config.database,
  synchronize: true,
  logging: true,
  entities: [ChatModel, HookModel],
  migrations: [],
  subscribers: []
})
