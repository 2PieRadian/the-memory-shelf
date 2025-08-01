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
exports.signup_post = signup_post;
exports.signin_post = signin_post;
const User_1 = __importDefault(require("../model/User"));
const Token_1 = __importDefault(require("../lib/Token"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function signup_post(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        // Bad Username
        if (username.length < 3 || username.length > 10) {
            res.status(411).send({ message: "Error in inputs" });
            return;
        }
        // Bad Password
        if (password.length < 8 || password.length > 20) {
            res.status(411).send({ message: "Error in inputs" });
            return;
        }
        // User already exists
        const userExistsAlready = yield User_1.default.findOne({ username });
        if (userExistsAlready) {
            res.status(403).send({ message: "User already exists with this username" });
            return;
        }
        // Creating the user with {username, password}
        try {
            yield User_1.default.create({ username, password });
            // Creating and Saving the JWT Token to the "Cookie"
            (0, Token_1.default)(username, res);
            res.status(200).send({
                message: `User created with {${username}, ${password}}`,
            });
        }
        catch (err) {
            res
                .status(500)
                .send({ mesage: "An error occurred while creating the user" });
        }
    });
}
function signin_post(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        const user = yield User_1.default.findOne({ username });
        // If user is not found
        if (!user) {
            return res.status(403).json({ message: "Sign up first" });
        }
        // Compare password
        const passwordMatches = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(403).json({ message: "Incorrect credentials" });
        }
        (0, Token_1.default)(username, res);
        res.status(200).json({ message: "Logged in successfully" });
    });
}
