import { WebsocketDataFrame } from "./types";

export const decodeFrame = (data: Buffer): WebsocketDataFrame => {
  const getBit = (byte: number, bit: number) => {
    return Boolean((byte >>> (7 - bit)) & 0x1);
  };

  const firstByte = data.readUInt8(0);
  const fin = getBit(firstByte, 0);
  const [rsv1, rsv2, rsv3] = [
    getBit(firstByte, 1),
    getBit(firstByte, 2),
    getBit(firstByte, 3),
  ];
  const opcode = firstByte & 0xf;

  const secondByte = data.readUInt8(1);
  const isMask = getBit(secondByte, 0);

  let offset = 2;
  let payloadLenght = secondByte & 0x7f;
  if (payloadLenght === 126) {
    payloadLenght = data.readUInt16BE(offset);
    offset += 2;
  } else if (payloadLenght == 127) {
    throw "Large payloads not supported";
  }

  let payload: Buffer = Buffer.alloc(payloadLenght);

  let mask = Buffer.alloc(4);
  if (isMask) {
    data.copy(mask, 0, offset, offset + 4);
    offset += 4;

    for (let i = 0; i < payloadLenght; i++) {
      payload[i] = data[offset + i] ^ mask[i % 4];
    }
  } else {
    data.copy(payload, 0, offset++);
  }

  return {
    fin,
    opcode,
    rsv1,
    rsv2,
    rsv3,
    isMask,
    payloadLenght,
    mask: mask.readUInt32BE(0),
    payloadData: payload,
  };
};

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
