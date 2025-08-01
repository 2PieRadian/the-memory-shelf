"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config");
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const authController_1 = require("./controller/authController");
const contentController_1 = __importDefault(require("./controller/contentController"));
const authMiddleware_1 = __importDefault(require("./middleware/authMiddleware"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
// Parse the body to JSON
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// SIGN-UP
app.post("/api/v1/signup", authController_1.signup_post);
// SIGN-IN
app.post("/api/v1/signin", authController_1.signin_post);
app.post("/api/v1/content", authMiddleware_1.default, contentController_1.default);
// Fetching all existing documents (no pagination)
app.get("/api/v1/content", (req, res) => { });
app.listen(3000, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.default)();
        console.log("listening on http://localhost:3000");
    }
    catch (err) {
        console.log(err);
    }
}));
