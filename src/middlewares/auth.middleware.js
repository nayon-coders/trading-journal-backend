"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const express_1 = require("express");
const index_1 = require("../index");
const protect = async (req, res, next) => {
    try {
        // Auth is disabled. Get or create a default user for all operations.
        let defaultUser = await index_1.prisma.user.findFirst({
            where: { email: 'default@example.com' }
        });
        if (!defaultUser) {
            defaultUser = await index_1.prisma.user.create({
                data: {
                    name: 'Default User',
                    email: 'default@example.com',
                    password: 'nopassword',
                }
            });
        }
        req.user = defaultUser;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Error assigning default user' });
    }
};
exports.protect = protect;
//# sourceMappingURL=auth.middleware.js.map