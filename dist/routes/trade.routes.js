"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const trade_controller_1 = require("../controllers/trade.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.protect);
router.route('/')
    .get(trade_controller_1.getTrades)
    .post(trade_controller_1.createTrade);
router.route('/:id')
    .get(trade_controller_1.getTrade)
    .put(trade_controller_1.updateTrade)
    .delete(trade_controller_1.deleteTrade);
exports.default = router;
//# sourceMappingURL=trade.routes.js.map