import { IsString, IsPhoneNumber, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ example: '+1234567890', description: 'Phone number with country code' })
  @IsPhoneNumber()
  phone: string;
}
