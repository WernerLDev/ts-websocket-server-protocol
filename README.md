# TypeScript websocket protocol

This is an (incomplete) implementation of the websocket protocol. This package can be used if you want to build your own websocket server. I have created this just for shits and giggles and do not recommend using this in production.

The protocol is implemented using typescript so obviously you will need to write your server in either JavaScript or TypeScript in order to use this package.

## Installation and usage

### Install package to your node.js project

Currently it is not published to the NPM registry yet. You can still install it with the following command:

`npm install WernerLDev/ts-websocket-server-protocol#main`

This will add the latest version to your node.js project.

### Example server

This package contains 3 methods that you can use. `generateHandshake`, `decodeFrame` and `encodeFrame`. The first one is to generate the initial handshake when you receive a request from a web browser, the other 2 can be used to encode/decode websocket frames.

A simple websocket server could be implemented like this:

```typescript
import * as http from "http";
import * as net from "net";
import * as ws from "ts-websocket-server-protocol";

const port = 1234;
const host = "127.0.0.1";
const url = "/";

const server = http.createServer((req, res) => {
  console.log("Received request");
});

server.on("upgrade", (req: http.IncomingMessage, socket: net.Socket) => {
  if (
    req.headers["upgrade"] != "websocket" ||
    req.method != "GET" ||
    req.url != url
  ) {
    socket.end("HTTP/1.1 400 Bad Request");
    return;
  }

  socket.write(ws.generateHandshake(req.headers["sec-websocket-key"] ?? ""));

  socket.on("data", (data) => {
    const frame = ws.decodeFrame(data);
    console.log(frame.payloadData.toString());

    socket.write(ws.encodeFrame(Buffer.from("Hi webbrowser")));
  });
});

server.listen(port, host, () => {
  console.log(`server started on ${host}:${port}`);
});
```
