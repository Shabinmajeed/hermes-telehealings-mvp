import { IsString, Length, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ description: 'OTP ID returned from send-otp' })
  @IsString()
  @IsNotEmpty()
  otpId: string;

  @ApiProperty({ example: '123456', description: '6-digit OTP code' })
  @Length(6, 6)
  @IsString()
  code: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
