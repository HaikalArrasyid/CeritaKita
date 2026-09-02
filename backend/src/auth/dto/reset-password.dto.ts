import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Email tidak valid' })
  email: string;

  @IsString()
  @Matches(/^\d{6}$/, { message: 'Kode OTP harus 6 digit' })
  otp: string;

  @IsString()
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  newPassword: string;
}
