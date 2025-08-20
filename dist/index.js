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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const authController_1 = require("./controller/authController");
const contentController_1 = require("./controller/contentController");
const authMiddleware_1 = __importDefault(require("./middleware/authMiddleware"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// Parse the body to JSON
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
// Check-auth
app.get("/api/v1/checkauth", authMiddleware_1.default, authController_1.checkAuth);
// Sign-up
app.post("/api/v1/signup", authController_1.signup_post);
// Sign-in
app.post("/api/v1/signin", authController_1.signin_post);
// Creating new content
app.post("/api/v1/content", authMiddleware_1.default, contentController_1.create_content);
// Fetching all existing content
app.get("/api/v1/content", authMiddleware_1.default, contentController_1.get_content);
app.delete("/api/v1/content", authMiddleware_1.default, contentController_1.delete_content);
// Create a sharable link
app.post("/api/v1/share", authMiddleware_1.default, contentController_1.create_sharable_link);
// Show users the content at the sharable link
app.get("/share/:unique_string", authMiddleware_1.default, contentController_1.get_sharable_link_content);
// Delete the sharable link
app.delete("api/v1/share", authMiddleware_1.default, contentController_1.delete_sharable_link);
app.listen(3000, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.default)();
        console.log("listening on http://localhost:3000");
    }
    catch (err) {
        console.log(err);
    }
}));
