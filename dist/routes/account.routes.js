"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const account_controller_1 = require("../controllers/account.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.protect);
router.route('/')
    .get(account_controller_1.getAccounts)
    .post(account_controller_1.createAccount);
router.route('/:id')
    .get(account_controller_1.getAccount)
    .put(account_controller_1.updateAccount)
    .delete(account_controller_1.deleteAccount);
exports.default = router;
//# sourceMappingURL=account.routes.js.map