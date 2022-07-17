import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { RoomsManager } from './rooms.manager'
import { SocketsEvents } from './interface/sockets.enum'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomsGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  constructor(private roomsManager: RoomsManager) {}

  handleDisconnect(client: Socket) {
    const name = this.getClientName(client)

    const message = `${name}@${client.id} left.`

    this.roomsManager.leave(client.id)
    this.roomsManager.emit(client, SocketsEvents.SendMessage, {
      sender: 'Server',
      message,
    })
  }

  @SubscribeMessage(SocketsEvents.Join)
  async join(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const name = this.getClientName(client)
    const message = `${name}@${client.id} joined [#${data.room}].`

    this.roomsManager.join(data.room, client)
    this.roomsManager.emit(client, SocketsEvents.Join, {
      who: { id: client.id, name: name },
    })
    this.roomsManager.emit(client, SocketsEvents.SendMessage, {
      sender: 'Server',
      message,
    })
  }

  @SubscribeMessage(SocketsEvents.Leave)
  async leave(@ConnectedSocket() client: Socket): Promise<void> {
    const name = this.getClientName(client)
    const message = `${name}@${client.id} leaved room.`

    this.roomsManager.emit(client, SocketsEvents.SendMessage, {
      sender: 'Server',
      message,
    })
    this.roomsManager.emit(client, SocketsEvents.Leave, {
      who: { id: client.id, name: name },
    })
    this.roomsManager.leave(client.id)
  }

  @SubscribeMessage(SocketsEvents.SendMessage)
  async sendMessage(
    @MessageBody() data: { message: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { message } = data
    const sender = this.getClientName(client)

    this.roomsManager.emit(client, SocketsEvents.SendMessage, {
      sender,
      message,
    })
  }

  getClientName(client: Socket, alternative = 'Anon'): string {
    const name = client.handshake.query.name.toString()
    return name ? name : alternative
  }
}
