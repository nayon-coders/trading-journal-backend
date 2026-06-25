import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
export declare const getTrades: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createTrade: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getTrade: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateTrade: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteTrade: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=trade.controller.d.ts.map