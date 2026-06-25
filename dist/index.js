"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const path_1 = __importDefault(require("path"));
// Initialize Prisma
exports.prisma = new client_1.PrismaClient();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static files from the public directory
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'public', 'uploads')));
// Basic health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Trading Journal API is running' });
});
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const account_routes_1 = __importDefault(require("./routes/account.routes"));
const trade_routes_1 = __importDefault(require("./routes/trade.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const setup_routes_1 = __importDefault(require("./routes/setup.routes"));
// Use Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/accounts', account_routes_1.default);
app.use('/api/trades', trade_routes_1.default);
app.use('/api/analytics', analytics_routes_1.default);
app.use('/api/upload', upload_routes_1.default);
app.use('/api/setups', setup_routes_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=index.js.map