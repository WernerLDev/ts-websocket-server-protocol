"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeFrame = void 0;
var encodeFrame = function (data) {
    var payloadLength = data.length;
    var offset = 2;
    var framelength = 2 + payloadLength;
    if (payloadLength > 125) {
        framelength += 2;
        offset += 2;
    }
    var buffer = Buffer.alloc(framelength);
    buffer.writeUInt8(0x81, 0);
    buffer.writeUInt8(payloadLength, 1);
    data.copy(buffer, offset);
    return buffer;
};
exports.encodeFrame = encodeFrame;
//# sourceMappingURL=outgoing.js.map