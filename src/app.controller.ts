import { Controller, Get, HttpStatus, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Redirect('/docs', HttpStatus.FOUND)
  redirectToDocumentation(): void {}
}
