"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const express_1 = require("express");
const index_1 = require("../index");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user?.id;
        const trades = await index_1.prisma.trade.findMany({
            where: { userId, status: { in: ['Win', 'Loss', 'Break Even'] } },
        });
        let totalPnL = 0;
        let wins = 0;
        let losses = 0;
        let grossProfit = 0;
        let grossLoss = 0;
        let largestWin = 0;
        let largestLoss = 0;
        trades.forEach(trade => {
            if (trade.profitAmount) {
                totalPnL += trade.profitAmount;
                if (trade.profitAmount > 0) {
                    grossProfit += trade.profitAmount;
                    if (trade.profitAmount > largestWin)
                        largestWin = trade.profitAmount;
                }
                else if (trade.profitAmount < 0) {
                    grossLoss += Math.abs(trade.profitAmount);
                    if (trade.profitAmount < largestLoss)
                        largestLoss = trade.profitAmount;
                }
            }
            if (trade.status === 'Win')
                wins++;
            if (trade.status === 'Loss')
                losses++;
        });
        const totalTrades = wins + losses + trades.filter(t => t.status === 'Break Even').length;
        const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
        const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss) : (grossProfit > 0 ? grossProfit : 0);
        res.json({
            totalPnL,
            winRate,
            profitFactor,
            totalTrades,
            wins,
            losses,
            largestWin,
            largestLoss,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getDashboardStats = getDashboardStats;
//# sourceMappingURL=analytics.controller.js.map