import { Response } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middlewares/auth.middleware';
import fs from 'fs';
import path from 'path';

export const getTrades = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trades = await prisma.trade.findMany({
      where: { userId: (req.user?.id as string) },
      include: { account: true, setupRelation: true },
      orderBy: { tradeDate: 'desc' },
    });
    res.json(trades);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createTrade = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tradeData = req.body;
    
    // Verify account belongs to user
    const account = await prisma.account.findFirst({
      where: { id: tradeData.accountId, userId: (req.user?.id as string) },
    });

    if (!account) {
      res.status(404).json({ message: 'Account not found' });
      return;
    }

    const trade = await prisma.trade.create({
      data: {
        accountId: tradeData.accountId,
        tradeDate: new Date(tradeData.tradeDate),
        tradeTime: tradeData.tradeTime,
        pair: tradeData.pair,
        direction: tradeData.direction,
        bias: tradeData.bias,
        setup: tradeData.setup,
        setupId: tradeData.setupId || null,
        confidence: tradeData.confidence,
        session: tradeData.session,
        entryPrice: parseFloat(tradeData.entryPrice),
        status: tradeData.status,
        profitAmount: tradeData.profitAmount ? parseFloat(tradeData.profitAmount) : null,
        lotSize: tradeData.lotSize ? parseFloat(tradeData.lotSize) : null,
        rrRatio: tradeData.rrRatio ? parseFloat(tradeData.rrRatio) : null,
        riskAmount: tradeData.riskAmount ? parseFloat(tradeData.riskAmount) : null,
        preTradeNote: tradeData.preTradeNote,
        executionNote: tradeData.executionNote,
        mistakeNote: tradeData.mistakeNote,
        lessonNote: tradeData.lessonNote,
        imageUrlBefore: tradeData.imageUrlBefore || null,
        userId: (req.user!.id as string),
      },
    });

    res.status(201).json(trade);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrade = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const trade = await prisma.trade.findFirst({
      where: { id, userId: (req.user?.id as string) },
      include: { account: true, setupRelation: true },
    });

    if (trade) {
      res.json(trade);
    } else {
      res.status(404).json({ message: 'Trade not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTrade = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trade = await prisma.trade.findFirst({
      where: { id: (req.params.id as string), userId: (req.user?.id as string) },
    });

    if (!trade) {
      res.status(404).json({ message: 'Trade not found' });
      return;
    }

    const updatedData = { ...req.body };
    if (updatedData.tradeDate) {
      updatedData.tradeDate = new Date(updatedData.tradeDate);
    }
    if (updatedData.setupId === '') {
      updatedData.setupId = null;
    }
    if (updatedData.imageUrlBefore === '') {
      updatedData.imageUrlBefore = null;
    }

    const updatedTrade = await prisma.trade.update({
      where: { id: (req.params.id as string) },
      data: updatedData,
    });

    res.json(updatedTrade);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTrade = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trade = await prisma.trade.findFirst({
      where: { id: (req.params.id as string), userId: (req.user?.id as string) },
    });

    if (!trade) {
      res.status(404).json({ message: 'Trade not found' });
      return;
    }

    // Extract image filenames and delete them from the file system
    const allText = [
      trade.imageUrlBefore,
      trade.preTradeNote,
      trade.executionNote,
      trade.mistakeNote,
      trade.lessonNote
    ].filter(Boolean).join(' ');

    const imageRegex = /\/uploads\/([^\s"'<>]+)/g;
    const matches = [...allText.matchAll(imageRegex)];
    
    // Get unique filenames
    const filenamesToDelete = [...new Set(matches.map(m => m[1] as string))];
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    filenamesToDelete.forEach(filename => {
      const filePath = path.join(uploadDir, filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error(`Failed to delete image: ${filePath}`, err);
        }
      }
    });

    await prisma.trade.delete({
      where: { id: (req.params.id as string) },
    });

    res.json({ message: 'Trade removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
