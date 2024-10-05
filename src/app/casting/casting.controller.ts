import { Controller, Get, Param, Patch, Post } from '@nestjs/common';

@Controller('cast')
export class CastingController {
  @Post()
  addCasting() {}

  @Patch(':userId')
  updateUserCasting(@Param('userId') userId: string) {}

  @Get('highlight')
  getHighlightedCastingUsers() {}

  @Patch(':userId/highlight')
  highlightUser(@Param('userId') userId: string) {}
}
