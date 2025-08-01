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
exports.default = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../model/User"));
function authMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies.token;
        // If there is no token in the cookie
        if (!token) {
            res.status(401).json({ message: "No token found in cookies!" });
            return;
        }
        try {
            // decoded = {username: 'some username'} / payload
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // Search the decoded "username" in the DB
            const user = yield User_1.default.findOne({ username: decoded.username }).select("-password");
            if (!user) {
                res.status(401).json({ message: "User not found" });
                return;
            }
            // Adding the user to the request
            req.user = user;
            next();
        }
        catch (err) {
            console.log("Error in authenticating JWT");
            res.status(401).json({ message: "Invalid or expired token" });
        }
    });
}
