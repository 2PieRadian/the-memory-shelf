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
exports.create_content = create_content;
exports.delete_content = delete_content;
exports.get_content = get_content;
exports.create_sharable_link = create_sharable_link;
exports.get_sharable_link_content = get_sharable_link_content;
exports.delete_sharable_link = delete_sharable_link;
const Content_1 = __importDefault(require("../model/Content"));
const RandomStringGenerator_1 = __importDefault(require("../lib/RandomStringGenerator"));
const Link_1 = __importDefault(require("../model/Link"));
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
function delete_content(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { contentId } = req.body;
        try {
            yield Content_1.default.findByIdAndDelete(contentId);
            res.json({ message: "Content deleted successfully" });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ message: "Couldn't delete" });
        }
    });
}
// Fetching all existing content of the user
function get_content(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const savedContents = yield Content_1.default.find({ userId });
        if (!savedContents) {
            return res.status(404).json({ message: "No content found" });
        }
        return res.status(200).json({ contents: savedContents });
    });
}
// Creating a sharable link
function create_sharable_link(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const randomString = RandomStringGenerator_1.default.generate(15);
        yield Link_1.default.create({ hash: randomString, userId });
        const sharableLink = "localhost:3000/share/" + randomString;
        res
            .status(200)
            .json({ message: "Sharable link created", link: sharableLink });
    });
}
// Returning all the user's contents at their sharable link
function get_sharable_link_content(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const unique_string = req.params.unique_string;
        const link = yield Link_1.default.findOne({ hash: unique_string });
        if (!link) {
            return res.status(404).json({ message: "Sharable link not found" });
        }
        const userId = link.userId;
        const contents = yield Content_1.default.find({ userId: userId }).populate("userId", "email");
        return res.status(200).json({ contents });
    });
}
// Implement this
function delete_sharable_link(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.status(200).json({ message: "Sharable link deleted" });
    });
}
