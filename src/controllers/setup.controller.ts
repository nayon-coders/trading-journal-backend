import { Response } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getSetups = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const setups = await prisma.setup.findMany({
      where: { userId: req.user?.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(setups);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createSetup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, rules } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    if (!name) {
      res.status(400).json({ message: 'Setup name is required' });
      return;
    }

    const setup = await prisma.setup.create({
      data: {
        userId,
        name,
        description,
        rules,
      },
    });
    
    res.status(201).json(setup);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSetup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, rules } = req.body;
    const userId = req.user?.id;

    const setup = await prisma.setup.findFirst({
      where: { id, userId },
    });

    if (!setup) {
      res.status(404).json({ message: 'Setup not found' });
      return;
    }

    const updatedSetup = await prisma.setup.update({
      where: { id },
      data: { name, description, rules },
    });
    
    res.json(updatedSetup);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSetup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Verify ownership
    const setup = await prisma.setup.findFirst({
      where: { id, userId: req.user?.id },
    });

    if (!setup) {
      res.status(404).json({ message: 'Setup not found' });
      return;
    }

    await prisma.setup.delete({
      where: { id },
    });
    
    res.json({ message: 'Setup deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
