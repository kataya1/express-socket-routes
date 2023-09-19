# expresssocket

An unoppinianated library for the http upgrade event's socket routing

It's used to create socket routes in express

It's usually used in tandom with ws

## usage:

```javascript
const express = require("express");
const app = express();
const _ = require("express-socket-routes")(app);
```

the "\_" is used so that you can ignore the return as the function is of the return type void

## Routing:

```javascript
app.sRoute("/room/:id", (request, socket, head) => {});
```

## using it in your application:

### [Demo App 1](https://github.com/kataya1/expresssocket-Apps/blob/main/demoApp1Server.js) (demonstrates usage with only one websocket server):

```javascript
const WebSocket = require("ws");
const webSocketServer = new WebSocket.Server({ noServer: true });

app.sRoute("/room/:id", (request, socket, head) => {
  webSocketServer.handleUpgrade(request, socket, head, (webSocket) => {
    webSocketServer.emit("connection", webSocket, request);
  });
});
```

### [Demo App 2](https://github.com/kataya1/expresssocket-Apps/blob/main/demoAppNservers.js) (demonstrates usage with Many websocket servers):

```javascript
const _ = require("express-socket-routes")(app);
const WebSocket = require("ws");

const webSocketServers = {};

app.sRoute("/room/:id", (req, socket, head) => {
  const roomId = req.params.id;
  let newlyCreatedWebSocketServer;
  if (!webSocketServers[roomId]) {
    // create a new websocket server for this room
    newlyCreatedWebSocketServer = new WebSocket.Server({ noServer: true });

    newlyCreatedWebSocketServer.on("connection", (ws) => {
      // connection handling here
    });
    webSocketServers[roomId] = newlyCreatedWebSocketServer;
  }

  newlyCreatedWebSocketServer.handleUpgrade(req, socket, head, (ws) => {
    newlyCreatedWebSocketServer.emit("connection", ws);
  });
});
```

## Common errors:

- using "room/:id" instead of "/room/:id" as routes
