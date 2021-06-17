export const encodeFrame = (data: Buffer): Buffer => {
  const payloadLength = data.length;

  let offset = 2;

  let framelength = 2 + payloadLength;
  if (payloadLength > 125) {
    framelength += 2;
    offset += 2;
  }

  const buffer = Buffer.alloc(framelength);
  buffer.writeUInt8(0x81, 0);
  buffer.writeUInt8(payloadLength, 1);

  data.copy(buffer, offset);

  return buffer;
};
