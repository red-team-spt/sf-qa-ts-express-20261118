import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface AuthedRequest extends Request {
  user?: { id: number; role: string };
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  try {
    req.user = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] }) as { id: number; role: string };
    next();
  } catch {
    res.status(401).json({ error: 'unauthorized' });
  }
}
