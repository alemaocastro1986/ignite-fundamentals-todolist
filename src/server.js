import http from "node:http";
import { json } from "./middleares/json.js";
import { routes } from "./routes.js";
import { extractQueryparameters } from "./utils/extract-qeury-parameters.js";

const server = http.createServer(async (request, response) => {
  const { method, url } = request;
  await json(request, response);
  const route = routes.find(
    (route) => route.method === method && route.path.test(url)
  );
  if (route) {
    const routeParams = request.url.match(route.path);
    const { query, ...params } = routeParams.groups;
    const routeQuery = query ? extractQueryparameters(query) : {};
    request.params = { ...params };
    request.query = routeQuery;
    return route.handler(request, response);
  }
  return response.writeHead(404).json({ message: "Not Found" });
});

server.listen(3333);
