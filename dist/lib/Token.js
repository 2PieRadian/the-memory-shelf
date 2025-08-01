"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const maxAgeInMS = 1000 * 60 * 60 * 24 * 7; // 7 days
function createToken(username, res) {
    const token = jsonwebtoken_1.default.sign({ username }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, { maxAge: maxAgeInMS, httpOnly: true });
}
