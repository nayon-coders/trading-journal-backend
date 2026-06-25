"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.updateAccount = exports.getAccount = exports.createAccount = exports.getAccounts = void 0;
const index_1 = require("../index");
// Get all accounts for logged in user
const getAccounts = async (req, res) => {
    try {
        const accounts = await index_1.prisma.account.findMany({
            where: { userId: req.user?.id },
            orderBy: { createdAt: 'desc' },
        });
        res.json(accounts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAccounts = getAccounts;
// Create a new account
const createAccount = async (req, res) => {
    try {
        const { accountName, brokerName, startingBalance, accountType, currency } = req.body;
        if (!accountName || startingBalance === undefined || !accountType) {
            res.status(400).json({ message: 'Please provide required fields' });
            return;
        }
        const account = await index_1.prisma.account.create({
            data: {
                userId: req.user.id,
                accountName,
                brokerName,
                startingBalance,
                currentBalance: startingBalance,
                accountType,
                currency: currency || "USD",
            },
        });
        res.status(201).json(account);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createAccount = createAccount;
// Get single account
const getAccount = async (req, res) => {
    try {
        const account = await index_1.prisma.account.findFirst({
            where: { id: req.params.id, userId: req.user?.id },
        });
        if (account) {
            res.json(account);
        }
        else {
            res.status(404).json({ message: 'Account not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAccount = getAccount;
// Update account
const updateAccount = async (req, res) => {
    try {
        const account = await index_1.prisma.account.findFirst({
            where: { id: req.params.id, userId: req.user?.id },
        });
        if (!account) {
            res.status(404).json({ message: 'Account not found' });
            return;
        }
        const { accountName, brokerName, startingBalance, accountType, currency } = req.body;
        const updatedAccount = await index_1.prisma.account.update({
            where: { id: req.params.id },
            data: {
                accountName,
                brokerName,
                startingBalance,
                accountType,
                currency,
            },
        });
        res.json(updatedAccount);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateAccount = updateAccount;
// Delete account
const deleteAccount = async (req, res) => {
    try {
        const account = await index_1.prisma.account.findFirst({
            where: { id: req.params.id, userId: req.user?.id },
        });
        if (!account) {
            res.status(404).json({ message: 'Account not found' });
            return;
        }
        await index_1.prisma.account.delete({
            where: { id: req.params.id },
        });
        res.json({ message: 'Account removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteAccount = deleteAccount;
//# sourceMappingURL=account.controller.js.map