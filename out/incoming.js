"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeFrame = void 0;
var decodeFrame = function (data) {
    var getBit = function (byte, bit) {
        return Boolean((byte >>> (7 - bit)) & 0x1);
    };
    var firstByte = data.readUInt8(0);
    var fin = getBit(firstByte, 0);
    var _a = [
        getBit(firstByte, 1),
        getBit(firstByte, 2),
        getBit(firstByte, 3),
    ], rsv1 = _a[0], rsv2 = _a[1], rsv3 = _a[2];
    var opcode = firstByte & 0xf;
    var secondByte = data.readUInt8(1);
    var isMask = getBit(secondByte, 0);
    var offset = 2;
    var payloadLenght = secondByte & 0x7f;
    if (payloadLenght === 126) {
        payloadLenght = data.readUInt16BE(offset);
        offset += 2;
    }
    else if (payloadLenght == 127) {
        throw "Large payloads not supported";
    }
    var payload = Buffer.alloc(payloadLenght);
    var mask = Buffer.alloc(4);
    if (isMask) {
        data.copy(mask, 0, offset, offset + 4);
        offset += 4;
        for (var i = 0; i < payloadLenght; i++) {
            payload[i] = data[offset + i] ^ mask[i % 4];
        }
    }
    else {
        data.copy(payload, 0, offset++);
    }
    return {
        fin: fin,
        opcode: opcode,
        rsv1: rsv1,
        rsv2: rsv2,
        rsv3: rsv3,
        isMask: isMask,
        payloadLenght: payloadLenght,
        mask: mask.readUInt32BE(0),
        payloadData: payload,
    };
};
exports.decodeFrame = decodeFrame;
/*

      0                   1                   2                   3
      0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
     +-+-+-+-+-------+-+-------------+-------------------------------+
     |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
     |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
     |N|V|V|V|       |S|             |   (if payload len==126/127)   |
     | |1|2|3|       |K|             |                               |
     +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
     |     Extended payload length continued, if payload len == 127  |
     + - - - - - - - - - - - - - - - +-------------------------------+
     |                               |Masking-key, if MASK set to 1  |
     +-------------------------------+-------------------------------+
     | Masking-key (continued)       |          Payload Data         |
     +-------------------------------- - - - - - - - - - - - - - - - +
     :                     Payload Data continued ...                :
     + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
     |                     Payload Data continued ...                |
     +---------------------------------------------------------------+

*/
//# sourceMappingURL=incoming.js.map