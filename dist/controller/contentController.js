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
exports.default = create_content;
const Content_1 = __importDefault(require("../model/Content"));
function create_content(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { title, link, type } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        try {
            yield Content_1.default.create({
                title,
                link,
                type,
                tags: [],
                userId,
            });
            res.status(200).json({ message: "Content Added" });
        }
        catch (e) {
            console.error("Error creating content: ", e);
            res.status(500).json({ message: "Error in adding the content" });
        }
    });
}
