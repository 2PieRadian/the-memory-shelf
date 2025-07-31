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
const User_1 = __importDefault(require("./model/User"));
const db_1 = __importDefault(require("./db"));
const Token_1 = __importDefault(require("./lib/Token"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// SIGN-UP
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const token = (0, Token_1.default)(username, res);
        res.status(200).send({
            message: `User created with {${username}, ${password}}. JWT: [${token}]`,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
            res
                .status(500)
                .send({ mesage: "An error occurred while creating the user" });
        }
        else {
            console.log("An unknown error occurred");
            res
                .status(500)
                .send({ mesage: "An error occurred while creating the user" });
        }
    }
}));
// SIGN-IN
app.post("/api/v1/signin", (req, res) => { });
app.post("/api/v1/content", (req, res) => { });
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
