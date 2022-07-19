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

  constructor(private manager: RoomsManager) {}

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.manager.leave(client)
  }

  @SubscribeMessage(SocketsEvents.Join)
  async join(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.manager.join(client, data.room)
  }

  @SubscribeMessage(SocketsEvents.Leave)
  async leave(@ConnectedSocket() client: Socket): Promise<void> {
    this.manager.leave(client)
  }

  @SubscribeMessage(SocketsEvents.SendMessage)
  async sendMessage(
    @MessageBody() data: { message: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.manager.message(client, data.message)
  }
}
