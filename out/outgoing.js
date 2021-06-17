"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeTextFrame = void 0;
var encodeTextFrame = function (data) {
    var payloadLength = Buffer.byteLength(data);
    var offset = 2;
    var framelength = 2 + payloadLength;
    if (payloadLength > 125) {
        framelength += 2;
        offset += 2;
    }
    var buffer = Buffer.alloc(framelength);
    buffer.writeUInt8(0x81, 0);
    buffer.writeUInt8(payloadLength, 1);
    buffer.write(data, offset);
    return buffer;
};
exports.encodeTextFrame = encodeTextFrame;
//# sourceMappingURL=outgoing.js.map