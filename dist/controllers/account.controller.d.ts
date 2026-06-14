import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
export declare const getAccounts: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createAccount: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAccount: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateAccount: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteAccount: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=account.controller.d.ts.map