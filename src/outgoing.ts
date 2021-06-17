export const encodeTextFrame = (data: string): Buffer => {
  const payloadLength = Buffer.byteLength(data);

  let offset = 2;

  let framelength = 2 + payloadLength;
  if (payloadLength > 125) {
    framelength += 2;
    offset += 2;
  }

  const buffer = Buffer.alloc(framelength);
  buffer.writeUInt8(0x81, 0);
  buffer.writeUInt8(payloadLength, 1);

  buffer.write(data, offset);

  return buffer;
};
