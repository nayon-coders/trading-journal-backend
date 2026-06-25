import { Response } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getSetups = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const setups = await prisma.setup.findMany({
      where: { userId: (req.user?.id as string) },
      orderBy: { createdAt: 'desc' },
    });
    res.json(setups);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createSetup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, rules, checklist } = req.body;
    const userId = (req.user?.id as string);

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
        checklist: checklist || [],
      },
    });
    
    res.status(201).json(setup);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSetup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, description, rules, checklist } = req.body;
    const userId = (req.user?.id as string);

    const setup = await prisma.setup.findFirst({
      where: { id, userId },
    });

    if (!setup) {
      res.status(404).json({ message: 'Setup not found' });
      return;
    }

    const updatedSetup = await prisma.setup.update({
      where: { id },
      data: { name, description, rules, checklist: checklist || [] },
    });
    
    res.json(updatedSetup);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSetup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    
    // Verify ownership
    const setup = await prisma.setup.findFirst({
      where: { id, userId: (req.user?.id as string) },
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
