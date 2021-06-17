"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHandshake = void 0;
var sha1_1 = __importDefault(require("sha1"));
var generateResponseHash = function (key) {
    return Buffer.from(sha1_1.default(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11", { asBytes: true })).toString("base64");
};
var generateHandshake = function (key) {
    return ("HTTP/1.1 101 Web Socket Protocol Handshake\r\n" +
        "Upgrade: WebSocket\r\n" +
        "Connection: Upgrade\r\n" +
        "Sec-WebSocket-Accept: " +
        generateResponseHash(key) +
        "\r\n\r\n");
};
exports.generateHandshake = generateHandshake;
//# sourceMappingURL=handshake.js.map