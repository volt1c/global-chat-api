import { Module } from '@nestjs/common'
import { RoomsController } from './rooms.controller'
import { RoomsEmiter } from './rooms.emiter'
import { RoomsGateway } from './rooms.gateway'
import { RoomsManager } from './rooms.manager'
import { RoomsRepository } from './rooms.repository'
import { RoomsService } from './rooms.service'

@Module({
  controllers: [RoomsController],
  providers: [
    RoomsService,
    RoomsGateway,
    RoomsManager,
    RoomsEmiter,
    RoomsRepository,
  ],
})
export class RoomsModule {}
