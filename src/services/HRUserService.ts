import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { db } from '../config/database';
import { HRUser, HRUserLoginDTO } from '../types';

export class HRUserService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

  async findByEmail(email: string): Promise<HRUser | null> {
    return db('hr_users').where('email', email).first();
  }

  async validateCredentials(email: string, password: string): Promise<HRUser | null> {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    return isValidPassword ? user : null;
  }

  async login(loginDTO: HRUserLoginDTO): Promise<{ token: string; user: Omit<HRUser, 'password_hash'> }> {
    const user = await this.validateCredentials(loginDTO.email, loginDTO.password);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const options: SignOptions = {
      expiresIn: HRUserService.JWT_EXPIRES_IN as unknown as any,
    };

    const token = jwt.sign(payload, HRUserService.JWT_SECRET, options);

    // Remove password_hash from user object
    const { password_hash, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, HRUserService.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}