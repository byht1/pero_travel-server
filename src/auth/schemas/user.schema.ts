import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @ApiProperty({ example: 'user@gmail.com', description: 'Пошта' })
  @Prop({
    type: String,
    unique: true,
    required: true,
  })
  email: string;

  @ApiProperty({
    example: '$2a$10$ngUzuMKTAHIMejbgVISD2O08Ry2Y1wBOLs0B3dEO7B3f5b8.4uae6',
    description: 'Пароль',
  })
  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @ApiProperty({ example: '', description: 'Токен' })
  @Prop({
    type: String,
    default: null,
  })
  token: string;

  @ApiProperty({ example: false, description: 'Чи підтверджена пошта' })
  @Prop({
    type: Boolean,
    default: false,
  })
  isActivate: boolean;

  @ApiProperty({
    example: 'b571633d-2250-4ed4-a9c2-203e569aee35',
    description: 'посилання для активації',
  })
  @Prop({
    type: String,
    required: true,
  })
  activateLink: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
