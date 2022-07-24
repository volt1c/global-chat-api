export interface RoomDto {
  name: string
  clients: {
    id: string
    name: string
  }[]
  max?: number
}
