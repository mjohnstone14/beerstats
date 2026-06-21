import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('beers')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async searchBeers(@Query('search') search?: string) {
    return this.appService.searchBeers(search || '');
  }

  @Get(':id')
  async getBeerById(@Param('id') id: string) {
    try {
      return await this.appService.getBeerById(id);
    } catch (error: any) {
      throw new NotFoundException(error.message || "We couldn't find the details for this beer.");
    }
  }
}
