import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AuthService } from './auth.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Current } from './schemas/current.schema';
import { Token } from './schemas/token.schema';
import { User } from './schemas/user.schema';

@ApiTags('User')
@Controller('user')
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @ApiResponse({
    status: 201,
    type: User,
  })
  @ApiResponse({ status: 409, description: 'Email in use' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @Post('/singup')
  singUp(@Body() UserDto: UserDto) {
    return this.AuthService.singUp(UserDto);
  }

  @ApiResponse({
    status: 201,
    type: Token,
  })
  @ApiResponse({ status: 401, description: 'Incorrect email or password' })
  @Post('/login')
  logIn(@Body() UserDto: UserDto) {
    return this.AuthService.logIn(UserDto);
  }

  @ApiHeader({
    name: 'Authorization',
    required: true,
    description: 'The token issued to the current user.',
  })
  @ApiResponse({ status: 204, description: 'The user is logged out' })
  @ApiResponse({ status: 401, description: 'Not authorized' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Get('/logout')
  logOut(@Req() req: Request) {
    const {
      user: { id },
    }: any = req;
    return this.AuthService.logOut(id);
  }

  @ApiHeader({
    name: 'Authorization',
    required: true,
    description: 'The token issued to the current user.',
  })
  @ApiResponse({ status: 200, type: Current })
  @ApiResponse({ status: 401, description: 'Not authorized' })
  @UseGuards(JwtAuthGuard)
  @Get('/current')
  current(@Req() req: Request) {
    const { user }: any = req;
    return this.AuthService.current(user);
  }
}
