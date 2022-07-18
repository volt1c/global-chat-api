import { BadRequestException, Injectable } from '@nestjs/common'
import { RoomDto } from './dto/room.dto'
import { RoomsRepository } from './rooms.repository'

@Injectable()
export class RoomsService {
  constructor(private repository: RoomsRepository) {}

  async findAll(): Promise<RoomDto[]> {
    return this.repository.findAll().map((room) => ({
      name: room.name,
      clients: room.clients.map((client) => ({
        id: client.id,
        name: (client.handshake.query.name ?? 'Anon').toString(),
      })),
    }))
  }

  async findOne(roomId: string): Promise<RoomDto> {
    if (!this.repository.has(roomId))
      throw new BadRequestException('incorrect id')

    const { name, clients } = this.repository.findOne(roomId)

    return {
      name,
      clients: clients.map((client) => ({
        id: client.id,
        name: (client.handshake.query.name ?? 'Anon').toString(),
      })),
    }
  }

  async findByClientId(clientId: string): Promise<RoomDto> {
    const room = this.repository.findByClientId(clientId)

    if (room === undefined) throw new BadRequestException('incorrect id')

    return {
      name: room.name,
      clients: room.clients.map((client) => ({
        id: client.id,
        name: (client.handshake.query.name ?? 'Anon').toString(),
      })),
    }
  }
}
