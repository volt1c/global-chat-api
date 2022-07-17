import { Injectable } from '@nestjs/common'
import { Socket } from 'socket.io'
import { Room } from './interface/room.interface'

@Injectable()
export class RoomsRepository {
  private clientsRooms: Map<string, string>
  private rooms: Room[]

  constructor() {
    this.clientsRooms = new Map()
    this.rooms = new Array(10).fill(undefined).map((_, idx) => ({
      name: `${idx}`,
      clients: [],
    }))
  }

  findAll(): Room[] {
    return this.rooms
  }

  findOne(id: string): Room {
    return this.rooms.find((room) => room.name === id)
  }

  findByClientId(id: string): Room {
    const roomId = this.clientsRooms.get(id)
    return this.rooms.find((room) => room.name === roomId)
  }

  empty(id: string): void {
    this.rooms.find((room) => room.name === id).clients.length = 0
  }

  deleteClient(id: string): void {
    const roomId = this.clientsRooms.get(id)
    if (roomId === undefined) return

    this.findOne(roomId).clients = this.findOne(roomId).clients.filter(
      (client) => client.id !== id,
    )
    this.clientsRooms.delete(id)
  }

  setClient(roomId: string, client: Socket) {
    const room = this.findOne(roomId)
    if (room.clients.indexOf(client) === -1) {
      room.clients.push(client)
      this.clientsRooms.set(client.id, roomId)
    }
  }
}
