import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  addUser() {}

  @Get()
  getAllCastingUsers() {}

  @Patch(':userId')
  updateUser(@Param('userId') userId: string) {}

  @Get('highlight')
  getHighlightedUsers() {}

  @Patch(':userId/highlight')
  highlightUser(@Param('userId') userId: string) {}
}
