import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import { TUserToken } from 'src/type/type-user-token';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async singUp(userDto: UserDto): Promise<UserDocument> {
    const { email, password } = userDto;
    const isUser = await this.userModel.findOne({ email });

    if (isUser) {
      throw new HttpException('Email in use', HttpStatus.CONFLICT);
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const activateLink = v4();

    const user = await this.userModel.create({
      email,
      password: hashPassword,
      activateLink,
    });

    return user;
  }

  async logIn(userDto: UserDto): Promise<string> {
    const user = await this.validateUser(userDto);

    const token = this.generalToken(user);

    return token;
  }

  async logOut(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { token: '' });
    return;
  }

  async current(user: TUserToken): Promise<{ token: string; email: string }> {
    const token = await this.generalToken(user);
    return { token, email: user.email };
  }

  private async generalToken(user): Promise<string> {
    const { id, email } = user;
    const payload = { id, email };
    const token = this.jwtService.sign(payload);

    await this.userModel.findByIdAndUpdate(id, { token });
    return token;
  }

  private async validateUser(userDto: UserDto) {
    const { email, password } = userDto;
    const user = await this.userModel.findOne({ email });
    const passwordEquals = await bcrypt.compare(password, user.password);
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'Incorrect email or password',
    });
  }
}
