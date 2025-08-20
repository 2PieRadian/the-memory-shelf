"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RandomStringGenerator {
    static generate(length) {
        let randomString = "";
        for (let i = 0; i < length; i++) {
            randomString +=
                this.characters[Math.floor(Math.random() * this.characters.length)];
        }
        return randomString;
    }
}
RandomStringGenerator.characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
exports.default = RandomStringGenerator;
