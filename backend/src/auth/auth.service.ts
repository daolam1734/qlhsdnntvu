import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(ten_dang_nhap: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(ten_dang_nhap);
    if (user && user.mat_khau_hash === pass) { // In real app, hash password
      const { mat_khau_hash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { ten_dang_nhap: user.ten_dang_nhap, sub: user.nguoi_dung_id, role: 'user' }; // Simplify role
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}