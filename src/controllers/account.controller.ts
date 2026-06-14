import { Response } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middlewares/auth.middleware';

// Get all accounts for logged in user
export const getAccounts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const accounts = await prisma.account.findMany({
      where: { userId: (req.user?.id as string) },
      orderBy: { createdAt: 'desc' },
    });
    res.json(accounts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new account
export const createAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { accountName, brokerName, startingBalance, accountType, currency } = req.body;
    
    if (!accountName || startingBalance === undefined || !accountType) {
      res.status(400).json({ message: 'Please provide required fields' });
      return;
    }

    const account = await prisma.account.create({
      data: {
        userId: (req.user!.id as string),
        accountName,
        brokerName,
        startingBalance,
        currentBalance: startingBalance,
        accountType,
        currency: currency || "USD",
      },
    });

    res.status(201).json(account);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get single account
export const getAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const account = await prisma.account.findFirst({
      where: { id: (req.params.id as string), userId: (req.user?.id as string) },
    });

    if (account) {
      res.json(account);
    } else {
      res.status(404).json({ message: 'Account not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update account
export const updateAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const account = await prisma.account.findFirst({
      where: { id: (req.params.id as string), userId: (req.user?.id as string) },
    });

    if (!account) {
      res.status(404).json({ message: 'Account not found' });
      return;
    }

    const { accountName, brokerName, startingBalance, accountType, currency } = req.body;
    const updatedAccount = await prisma.account.update({
      where: { id: (req.params.id as string) },
      data: {
        accountName,
        brokerName,
        startingBalance,
        accountType,
        currency,
      },
    });

    res.json(updatedAccount);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete account
export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const account = await prisma.account.findFirst({
      where: { id: (req.params.id as string), userId: (req.user?.id as string) },
    });

    if (!account) {
      res.status(404).json({ message: 'Account not found' });
      return;
    }

    await prisma.account.delete({
      where: { id: (req.params.id as string) },
    });

    res.json({ message: 'Account removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
