import { Controller, Get, Render } from '@nestjs/common';
import { homeContent } from './home.content';

@Controller()
export class HomeController {
  @Get()
  @Render('pages/home')
  home() {
    return homeContent;
  }
}
