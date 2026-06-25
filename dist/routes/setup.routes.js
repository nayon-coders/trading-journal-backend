"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const setup_controller_1 = require("../controllers/setup.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.protect);
router.route('/')
    .get(setup_controller_1.getSetups)
    .post(setup_controller_1.createSetup);
router.route('/:id')
    .put(setup_controller_1.updateSetup)
    .delete(setup_controller_1.deleteSetup);
exports.default = router;
//# sourceMappingURL=setup.routes.js.map