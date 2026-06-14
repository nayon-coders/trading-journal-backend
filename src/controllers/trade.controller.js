"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTrade = exports.updateTrade = exports.getTrade = exports.createTrade = exports.getTrades = void 0;
const express_1 = require("express");
const index_1 = require("../index");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getTrades = async (req, res) => {
    try {
        const trades = await index_1.prisma.trade.findMany({
            where: { userId: req.user?.id },
            include: { account: true, setupRelation: true },
            orderBy: { tradeDate: 'desc' },
        });
        res.json(trades);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getTrades = getTrades;
const createTrade = async (req, res) => {
    try {
        const tradeData = req.body;
        // Verify account belongs to user
        const account = await index_1.prisma.account.findFirst({
            where: { id: tradeData.accountId, userId: req.user?.id },
        });
        if (!account) {
            res.status(404).json({ message: 'Account not found' });
            return;
        }
        const trade = await index_1.prisma.trade.create({
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
                userId: req.user.id,
            },
        });
        res.status(201).json(trade);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createTrade = createTrade;
const getTrade = async (req, res) => {
    try {
        const { id } = req.params;
        const trade = await index_1.prisma.trade.findFirst({
            where: { id, userId: req.user?.id },
            include: { account: true, setupRelation: true },
        });
        if (trade) {
            res.json(trade);
        }
        else {
            res.status(404).json({ message: 'Trade not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getTrade = getTrade;
const updateTrade = async (req, res) => {
    try {
        const trade = await index_1.prisma.trade.findFirst({
            where: { id: req.params.id, userId: req.user?.id },
        });
        if (!trade) {
            res.status(404).json({ message: 'Trade not found' });
            return;
        }
        const updatedData = { ...req.body };
        if (updatedData.tradeDate) {
            updatedData.tradeDate = new Date(updatedData.tradeDate);
        }
        const updatedTrade = await index_1.prisma.trade.update({
            where: { id: req.params.id },
            data: updatedData,
        });
        res.json(updatedTrade);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateTrade = updateTrade;
const deleteTrade = async (req, res) => {
    try {
        const trade = await index_1.prisma.trade.findFirst({
            where: { id: req.params.id, userId: req.user?.id },
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
        const filenamesToDelete = [...new Set(matches.map(m => m[1]))];
        const uploadDir = path_1.default.join(process.cwd(), 'public', 'uploads');
        filenamesToDelete.forEach(filename => {
            const filePath = path_1.default.join(uploadDir, filename);
            if (fs_1.default.existsSync(filePath)) {
                try {
                    fs_1.default.unlinkSync(filePath);
                }
                catch (err) {
                    console.error(`Failed to delete image: ${filePath}`, err);
                }
            }
        });
        await index_1.prisma.trade.delete({
            where: { id: req.params.id },
        });
        res.json({ message: 'Trade removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteTrade = deleteTrade;
//# sourceMappingURL=trade.controller.js.map