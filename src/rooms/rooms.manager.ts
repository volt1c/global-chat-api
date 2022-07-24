import { Injectable } from '@nestjs/common'
import { WsException } from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { RoomsEmiter } from './rooms.emiter'
import { RoomsRepository } from './rooms.repository'

@Injectable()
export class RoomsManager {
  constructor(
    private repository: RoomsRepository,
    private emiter: RoomsEmiter,
  ) {}

  join(client: Socket, roomId: string) {
    const room = this.repository.findOne(roomId)

    if (!room) throw new WsException('incorrect room id')

    if (room.max && room.max <= room.clients.length)
      throw new WsException('room is full')

    if (this.repository.findByClientId(client.id)) {
      this.emiter.emitLeave(client)
      this.repository.deleteClient(client.id)
    }

    this.repository.setClient(roomId, client)
    this.emiter.emitJoin(client)
  }

  leave(client: Socket) {
    this.emiter.emitLeave(client)
    this.repository.deleteClient(client.id)
  }

  message(client: Socket, message: string) {
    this.emiter.emitMessage(client, message)
  }
}
