import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const [bearer, token] = req.headers.authorization.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new HttpException(
          { message: 'Not authorized' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const isValidToken = this.jwtService.verify(token);

      const user = await this.userModel.findById(isValidToken.id);

      if (!user || user.token !== token) {
        throw new HttpException(
          { message: 'Not authorized' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      req.user = user;

      return true;
    } catch (error) {
      throw new HttpException(
        { message: 'Not authorized' },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
