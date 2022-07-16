import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  teapot(): string {
    return "🍵 I'm a teapot. 🍵"
  }
}
