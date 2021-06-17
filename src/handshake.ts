import sha1 from "sha1";

const generateResponseHash = (key: string) => {
  return Buffer.from(
    sha1(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11", { asBytes: true })
  ).toString("base64");
};

export const HandshakeResponse = (key: string) => {
  return (
    "HTTP/1.1 101 Web Socket Protocol Handshake\r\n" +
    "Upgrade: WebSocket\r\n" +
    "Connection: Upgrade\r\n" +
    "Sec-WebSocket-Accept: " +
    generateResponseHash(key) +
    "\r\n\r\n"
  );
};
