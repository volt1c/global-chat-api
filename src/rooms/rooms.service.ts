import { Injectable } from '@nestjs/common'
import { RoomDto } from './dto/room.dto'
import { RoomsRepository } from './rooms.repository'

@Injectable()
export class RoomsService {
  constructor(private repository: RoomsRepository) {}

  async findAll(): Promise<RoomDto[]> {
    return this.repository.findAll().map((room) => ({
      name: room.name,
      clients: room.clients.map((client) => client.id),
    }))
  }

  async findOne(roomId: string): Promise<RoomDto> {
    const { name, clients } = this.repository.findOne(roomId)
    return { name, clients: clients.map((client) => client.id) }
  }

  async findByClientId(clientId: string): Promise<RoomDto> {
    const { name, clients } = this.repository.findByClientId(clientId)
    return { name, clients: clients.map((client) => client.id) }
  }
}
