import { Injectable } from '@nestjs/common'
import { WsException } from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { RoomsEmiter } from './rooms.emiter'
import { RoomsRepository } from './rooms.repository'

@Injectable()
export class RoomsManager {
  constructor(
    private roomsRepository: RoomsRepository,
    private emiter: RoomsEmiter,
  ) {}

  join(client: Socket, roomId: string) {
    if (!this.roomsRepository.findOne(roomId))
      throw new WsException('incorrect room id')

    if (this.roomsRepository.findByClientId(client.id)) {
      this.emiter.emitLeave(client)
      this.roomsRepository.deleteClient(client.id)
    }

    this.roomsRepository.setClient(roomId, client)
    this.emiter.emitJoin(client)
  }

  leave(client: Socket) {
    this.emiter.emitLeave(client)
    this.roomsRepository.deleteClient(client.id)
  }

  message(client: Socket, message: string) {
    this.emiter.emitMessage(client, message)
  }
}
