"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = __importDefault(require("./server"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
new server_1.default(app);
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});
