import { Injectable } from '@nestjs/common'
import { Socket } from 'socket.io'
import { Room } from './interface/room.interface'
import { SocketsEvents } from './interface/sockets.enum'
import { RoomsRepository } from './rooms.repository'

@Injectable()
export class RoomsEmiter {
  constructor(private roomsRepository: RoomsRepository) {}

  emitJoin(client: Socket) {
    this.emit(client, SocketsEvents.Join, {
      who: {
        id: client.id,
        name: (client.handshake.query.name ?? 'Anon').toString(),
      },
    })
  }

  emitLeave(client: Socket) {
    this.emit(client, SocketsEvents.Leave, {
      who: {
        id: client.id,
        name: (client.handshake.query.name ?? 'Anon').toString(),
      },
    })
  }

  emitMessage(client: Socket, message: string) {
    this.emit(client, SocketsEvents.SendMessage, {
      sender: {
        id: client.id,
        name: (client.handshake.query.name ?? 'Anon').toString(),
      },
      message,
    })
  }

  emitError(client: Socket, message: string) {
    this.emit(client, SocketsEvents.Exception, {
      message,
    })
  }

  private emit(client: Socket, event: string, data: any): void {
    const room = this.getRoom(client)
    if (room === undefined) return
    room.clients.forEach((client) => client.emit(event, data))
  }

  private getRoom(v: Socket | string): Room {
    return typeof v === 'string'
      ? this.roomsRepository.findOne(v)
      : this.roomsRepository.findByClientId(v.id)
  }
}
