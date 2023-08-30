const http = require('node:http')
// a secret route that is used in the get route the sRoute internally makes
const websocketRoute = "/secretwebsocketRoute1234secret";
// a map mapping the route to it's handler function
const globalAppWSClosure = new Map();

// one job: assign or modify methods in the express app
function augumentApp(app) {
  makeNewListenFunction(app)
  addsRouteMethodtoApp(app)
}
// one job: adds the sRoute method to the express app
function addsRouteMethodtoApp(app) {
  app.sRoute = (route, handler) => {
    app.get(websocketRoute + route, (req, res) => {
      res.json({ route, params: req.params });
    });
    globalAppWSClosure.set(route, handler);
  }

}
// one job: assign an event listener function to the upgrade event 
function makeNewListenFunction(app) {
  // Save a reference to the original .listen method
  const originalListen = app.listen;
  // Override with new listen method
  app.listen = function () {
    // Call original and get server instance
    const server = originalListen.apply(this, arguments);

    // Attach handler for upgrade event
    server.on("upgrade", async (req, socket, head) => {

      try {
        const port = server.address().port //get the port from the server so that
        // because getRouteparameter needs to send a request on the same port as the server
        const data = await getRouteParams(req.url, port);

        const parsedData = await JSON.parse(data);

        req.params = parsedData.params;

        const route = parsedData.route;
        const handlerFn = globalAppWSClosure.get(route);

        handlerFn(req, socket, head);
      } catch (err) {
        // handle errors
        console.error(err)
      }
    });

    return server;
  };
}

// one job: get's the route parameter from a url
function getRouteParams(url, port) {
  return new Promise((resolve, reject) => {
    const options = {
      host: "127.0.0.1",
      port: port,
      path: websocketRoute + url,
      method: "GET",
    };

    http
      .get(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve(data);
        });
      })
      .on("error", reject);
  });
}

module.exports = augumentApp;
