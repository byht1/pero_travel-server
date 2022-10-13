import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class Current {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNDcyMjExYmJkNDJiM2FjMmFlOWU4OSIsImVtYWlsIjoidml0YWxpa0BnbWFpbC5jb20iLCJpYXQiOjE2NjU2NTM2NzgsImV4cCI6MTY2NTc0MDA3OH0.m5gjbollZj-pdGfcn7Z1ppHgdZZOMKEw1j3N9VVZ97E',
    description: 'Токен',
  })
  @Prop()
  token: string;

  @ApiProperty({ example: 'user@gmail.com', description: 'Пошта' })
  @Prop()
  email: string;
}
