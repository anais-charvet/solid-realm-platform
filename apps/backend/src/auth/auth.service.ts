import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create(email, hashedPassword, name);
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}