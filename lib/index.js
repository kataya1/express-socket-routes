// TODO error handling, for the get request
// insure port number is the same as the server
// async/ await instead of http.get callback

// a map mapping the route to it's handler function
const websocketRoute = "/secretwebsocketRoute1234";
const globalAppWSClosure = new Map();
function myFunction(app) {
  // ... augment app
  // Save a reference to the original .listen method
  const originalListen = app.listen;

  // Override with new listen method
  app.listen = function () {
    // Call original and get server instance
    const server = originalListen.apply(this, arguments);

    // Attach handler for upgrade event
    server.on("upgrade", async (req, socket, head) => {
      console.log("🍅🍅🍅🍅🍅🍅");
      // pathname

      // try {
      //   const data = await getRouteParams(req.url);

      //   const parsedData = JSON.parse(data);

      //   req.params = parsedData.params;

      //   const route = parsedData.route;
      //   const handlerFn = globalAppWSClosure.get(route);

      //   handlerFn(req, socket, head);
      // } catch (err) {
      //   // handle errors
      // }
      const options = {
        host: "127.0.0.1",
        port: 8000,
        path: websocketRoute + req.url,
        method: "GET",
      };
      // making a get request to get the parameters in the route
      http.get(options, (response) => {
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => {
          const parsedData = JSON.parse(data);
          // Access JSON data in json variable
          console.log(parsedData);
          req.params = parsedData.params;
          let route = parsedData.route;
          let handlerFn = globalAppWSClosure.get(route);

          handlerFn(req, socket, head);
        });
      });
    });

    return server;
  };
}
// function getRouteParams(url) {
//   return new Promise((resolve, reject) => {
//     const options = {
//       host: "127.0.0.1",
//       port: 8000,
//       path: websocketRoute + url,
//       method: "GET",
//     };

//     http
//       .get(options, (res) => {
//         let data = "";

//         res.on("data", (chunk) => {
//           data += chunk;
//         });

//         res.on("end", () => {
//           resolve(JSON.parse(data));
//         });
//       })
//       .on("error", reject);
//   });
// }

export default myFunction;
// Also support CommonJS
module.exports = exports.default;
