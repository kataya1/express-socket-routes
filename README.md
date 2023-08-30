# expresssocket

An unoppinianated library for the http upgrade event's socket routing

It's used to create socket routes in express

It's used in tandom with ws

usage:

```javascript
const express = require("express");
const app = express();
const expressWs = require("express-socket-routes")(app);
```

Routing

```javascript
app.sRoute("/room/:id", (request, socket, head) => {});
```
