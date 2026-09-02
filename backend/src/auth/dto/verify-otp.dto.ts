import { IsEmail, IsString, Matches } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail({}, { message: 'Email tidak valid' })
  email: string;

  @IsString()
  @Matches(/^\d{6}$/, { message: 'Kode OTP harus 6 digit' })
  otp: string;
}
