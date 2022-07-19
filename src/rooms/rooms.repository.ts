import { Injectable } from '@nestjs/common'
import * as config from 'config'
import { Socket } from 'socket.io'
import { Room } from './interface/room.interface'

@Injectable()
export class RoomsRepository {
  private clientsRooms: Map<string, string>
  private rooms: Room[]

  constructor() {
    const rooms = config.get<[{ name: string }]>('rooms')
    this.clientsRooms = new Map()
    this.rooms = rooms.map((room, idx) => ({
      name: `${room.name ?? idx}`,
      clients: [],
    }))
  }

  findAll(): Room[] {
    return this.rooms
  }

  findOne(id: string): Room | undefined {
    return this.rooms.find((room) => room.name === id)
  }

  findByClientId(id: string): Room | undefined {
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

  has(roomId: string): boolean {
    return this.rooms.some((room) => room.name === roomId)
  }
}
