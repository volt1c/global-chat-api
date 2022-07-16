import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'

describe('AppController', () => {
  let appController: AppController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile()

    appController = app.get<AppController>(AppController)
  })

  describe('teapot', async () => {
    it('should return "🍵 I\'m a teapot. 🍵"', () => {
      expect(appController.teapot()).toBe("🍵 I'm a teapot. 🍵")
    })
  })
})
