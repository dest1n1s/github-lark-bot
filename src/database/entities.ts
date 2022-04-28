import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class ChatModel {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  chatId: string

  @ManyToOne(() => HookModel, (hook) => hook.chats)
  hook: HookModel

  constructor(chatId: string) {
    this.chatId = chatId
  }
}

@Entity()
export class HookModel {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  repo: string

  @OneToMany(() => ChatModel, (chat) => chat.hook)
  chats: ChatModel[]

  constructor(repo: string, chats: ChatModel[]) {
    this.repo = repo
    this.chats = chats
  }
}
