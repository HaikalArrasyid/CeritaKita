import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { JwtSignOptions } from '@nestjs/jwt';
import { OtpPurpose } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

interface AuthedUser {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private users: UsersService,
    private jwt: JwtService,
    private config: ConfigService,
    private mail: MailService,
  ) {}

  private signAccess(user: {
    id: string;
    username: string;
    email: string;
    role: string;
  }): Promise<string> {
    return this.jwt.signAsync(
      {
        sub: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: (this.config.get<string>('JWT_ACCESS_TTL') ||
          '15m') as JwtSignOptions['expiresIn'],
      },
    );
  }

  private signRefresh(userId: string): Promise<string> {
    return this.jwt.signAsync(
      { sub: userId },
      {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: (this.config.get<string>('JWT_REFRESH_TTL') ||
          '7d') as JwtSignOptions['expiresIn'],
      },
    );
  }

  private sanitize(user: AuthedUser) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const username = dto.username.trim();

    const existingEmail = await this.users.findByEmail(email);
    if (existingEmail) {
      throw new ConflictException('Email sudah terdaftar');
    }
    const existingUsername = await this.users.findByUsername(username);
    if (existingUsername) {
      throw new ConflictException('Username sudah digunakan');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.users.create({ username, email, passwordHash });

    return {
      accessToken: await this.signAccess(user),
      refreshToken: await this.signRefresh(user.id),
      user: this.sanitize(user),
    };
  }

  async login(email: string, password: string) {
    const normalized = email.trim().toLowerCase();
    const user = await this.users.findByEmail(normalized);
    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Email atau password salah');
    }
    return {
      accessToken: await this.signAccess(user),
      refreshToken: await this.signRefresh(user.id),
      user: this.sanitize(user),
    };
  }

  async refresh(refreshToken: string) {
    let payload: { sub: string };
    try {
      payload = await this.jwt.verifyAsync<{ sub: string }>(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Sesi berakhir, silakan login ulang');
    }
    const user = await this.users.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Sesi berakhir, silakan login ulang');
    }
    return {
      accessToken: await this.signAccess(user),
      refreshToken: await this.signRefresh(user.id),
      user: this.sanitize(user),
    };
  }

  async forgotPassword(email: string) {
    const normalized = email.trim().toLowerCase();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.otp.deleteMany({
      where: { email: normalized, purpose: OtpPurpose.PASSWORD_RESET },
    });
    await this.prisma.otp.create({
      data: {
        email: normalized,
        codeHash,
        purpose: OtpPurpose.PASSWORD_RESET,
        expiresAt,
      },
    });

    await this.mail.sendOtp(normalized, code);
    return { message: 'Jika email terdaftar, kode verifikasi telah dikirim.' };
  }

  private async findValidOtp(email: string, code: string) {
    const otp = await this.prisma.otp.findFirst({
      where: {
        email: email.trim().toLowerCase(),
        purpose: OtpPurpose.PASSWORD_RESET,
        consumedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
    if (!otp) {
      return null;
    }
    const ok = await bcrypt.compare(code, otp.codeHash);
    return ok ? otp : null;
  }

  async verifyOtp(email: string, code: string) {
    const otp = await this.findValidOtp(email, code);
    if (!otp) {
      throw new BadRequestException(
        'Kode verifikasi tidak valid atau sudah kedaluwarsa',
      );
    }
    return { ok: true };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const otp = await this.findValidOtp(email, code);
    if (!otp) {
      throw new BadRequestException(
        'Kode verifikasi tidak valid atau sudah kedaluwarsa',
      );
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { email: email.trim().toLowerCase() },
      data: { passwordHash },
    });
    await this.prisma.otp.update({
      where: { id: otp.id },
      data: { consumedAt: new Date() },
    });
    return { ok: true };
  }
}
