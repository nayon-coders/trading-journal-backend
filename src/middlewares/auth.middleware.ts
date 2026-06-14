import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Auth is disabled. Get or create a default user for all operations.
    let defaultUser = await prisma.user.findFirst({
      where: { email: 'default@example.com' }
    });

    if (!defaultUser) {
      defaultUser = await prisma.user.create({
        data: {
          name: 'Default User',
          email: 'default@example.com',
          password: 'nopassword',
        }
      });
    }

    req.user = defaultUser;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Error assigning default user' });
  }
};
