import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

import path from 'path';

// Initialize Prisma
export const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Trading Journal API is running' });
});

import authRoutes from './routes/auth.routes';
import accountRoutes from './routes/account.routes';
import tradeRoutes from './routes/trade.routes';
import analyticsRoutes from './routes/analytics.routes';
import uploadRoutes from './routes/upload.routes';
import setupRoutes from './routes/setup.routes';

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/setups', setupRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
