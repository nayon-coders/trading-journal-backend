"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSetup = exports.updateSetup = exports.createSetup = exports.getSetups = void 0;
const express_1 = require("express");
const index_1 = require("../index");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const getSetups = async (req, res) => {
    try {
        const setups = await index_1.prisma.setup.findMany({
            where: { userId: req.user?.id },
            orderBy: { createdAt: 'desc' },
        });
        res.json(setups);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getSetups = getSetups;
const createSetup = async (req, res) => {
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
        const setup = await index_1.prisma.setup.create({
            data: {
                userId,
                name,
                description,
                rules,
            },
        });
        res.status(201).json(setup);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createSetup = createSetup;
const updateSetup = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, rules } = req.body;
        const userId = req.user?.id;
        const setup = await index_1.prisma.setup.findFirst({
            where: { id, userId },
        });
        if (!setup) {
            res.status(404).json({ message: 'Setup not found' });
            return;
        }
        const updatedSetup = await index_1.prisma.setup.update({
            where: { id },
            data: { name, description, rules },
        });
        res.json(updatedSetup);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateSetup = updateSetup;
const deleteSetup = async (req, res) => {
    try {
        const { id } = req.params;
        // Verify ownership
        const setup = await index_1.prisma.setup.findFirst({
            where: { id, userId: req.user?.id },
        });
        if (!setup) {
            res.status(404).json({ message: 'Setup not found' });
            return;
        }
        await index_1.prisma.setup.delete({
            where: { id },
        });
        res.json({ message: 'Setup deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteSetup = deleteSetup;
//# sourceMappingURL=setup.controller.js.map