import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser } from "src/auth/current-user.decorator";
import { UserDto } from "./dto/user.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: CreateUserDto })
  async create(@CurrentUser() user: any, @Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const userId = user.uid;
    return await this.userService.create(userId, createUserDto);
  }


  @Get('')
  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({ type: UserDto })
  async findOne(@CurrentUser() user: any): Promise<UserDto> {
    const userId = user.uid;
    return await this.userService.findOne(userId);
  }

  @Delete('')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'Delete user' })
  async remove(@CurrentUser() user: any): Promise<void> {
    const userId = user.uid;
    return await this.userService.remove(userId);
  }
}