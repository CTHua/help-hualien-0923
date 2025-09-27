// auth/firebase-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as admin from 'firebase-admin';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    // ✅ 1. 先檢查是否有 @Public() 標記
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    // ✅ 2. 如果不是 public，就繼續驗證 token

    const req = ctx.switchToHttp().getRequest();
    const auth = req.headers['authorization'] || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

    if (process.env.NODE_ENV === 'development') {
      if (token === 'test-user') {
        req.user = {
          uid: 'test-user',
          name: 'test-user',
          email: 'test-user@test.com',
        };
        return true;
      }
    }

    if (!token) throw new UnauthorizedException('Missing Bearer token');

    try {
      const decoded = await admin.auth().verifyIdToken(token, true); // true 會尊重 revocation
      // 這裡可視需求檢查 email 是否驗證過
      // if (!decoded.email_verified) throw new UnauthorizedException('Email not verified');
      // 如果沒有 name，就隨機給他一個名字
      if (!decoded.name) {
        decoded.name = `user-${decoded.uid.slice(0, 5)}`;
      }
      req.user = decoded; // { uid, email, ...customClaims }
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }
}