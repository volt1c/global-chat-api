import { Controller, Get, Param } from '@nestjs/common'
import { RoomDto } from './dto/room.dto'
import { RoomsService } from './rooms.service'

@Controller('rooms')
export class RoomsController {
  constructor(private service: RoomsService) {}

  @Get()
  async findAll(): Promise<RoomDto[]> {
    return await this.service.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RoomDto> {
    return await this.service.findOne(id)
  }

  @Get('client/:id')
  async findByClientId(@Param('id') id: string): Promise<RoomDto> {
    return this.service.findByClientId(id)
  }
}
