import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth/middleware';

import { RegisterDto, LoginDto } from '../../dto/auth/dto';
import { AuthService } from '../../services/auth/service';
import { User } from '../../models/user/model';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const data = RegisterDto.parse(req.body);
      const user = await AuthService.register(
        data.name,
        data.email,
        data.password
      );

      res.status(201).json({ message: 'User registered', user });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const data = LoginDto.parse(req.body);
      const { user, token } = await AuthService.login(
        data.email,
        data.password
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({ message: 'Login successful', user });
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  }

  static logout(_req: Request, res: Response) {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
  }

  static async me(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });

      const user = await User.findById(req.userId).select('-passwordHash');
      res.json(user);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });

      const { name } = req.body;

      if (!name || name.trim().length === 0) {
        return res.status(400).json({ message: 'Name is required' });
      }

      const user = await User.findByIdAndUpdate(
        req.userId,
        { name: name.trim() },
        { new: true }
      ).select('-passwordHash');

      res.json({ message: 'Profile updated', user });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
