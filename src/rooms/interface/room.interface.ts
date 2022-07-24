import { Socket } from 'socket.io'

export interface Room {
  name: string
  clients: Socket[]
  max?: number
}
