"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const api_routes_1 = __importDefault(require("./api-routes"));
class Server {
    constructor(app) {
        this.config(app);
        new api_routes_1.default(app);
    }
    config(app) {
        const corsOptions = {
            origin: "*"
        };
        app.use((0, cors_1.default)(corsOptions));
        app.use(express_1.default.json({ limit: '50mb' }));
        app.use(express_1.default.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
        app.all("/*", function (req, res, next) {
            // res.header("Access-Control-Allow-Origin", "*");
            // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        app.get("/", (req, res) => {
            res.json({ message: "Welcome to the Express + TypeScript Server!" });
        });
    }
}
exports.default = Server;
