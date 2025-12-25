import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(ten_dang_nhap: string, mat_khau: string): Promise<any> {
    const user = await this.authService.validateUser(ten_dang_nhap, mat_khau);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}