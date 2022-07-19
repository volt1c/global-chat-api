import { Injectable } from '@nestjs/common'
import { Socket } from 'socket.io'
import { RoomsRepository } from './rooms.repository'

@Injectable()
export class RoomsManager {
  constructor(private roomsRepository: RoomsRepository) {}

  join(roomId: string, client: Socket) {
    if (!this.roomsRepository.findOne(roomId)) return
    if (this.roomsRepository.findByClientId(client.id))
      this.roomsRepository.deleteClient(client.id)
    this.roomsRepository.setClient(roomId, client)
  }

  leave(id: string) {
    return this.roomsRepository.deleteClient(id)
  }

  emit(roomId: string, event: string, data: any): void
  emit(client: Socket, event: string, data: any): void
  emit(clientOrRoomId: Socket | string, event: string, data: any): void {
    const room =
      typeof clientOrRoomId === 'string'
        ? this.roomsRepository.findOne(clientOrRoomId)
        : this.roomsRepository.findByClientId(clientOrRoomId.id)

    if (room === undefined) return

    room.clients.forEach((client) => client.emit(event, data))
  }
}
