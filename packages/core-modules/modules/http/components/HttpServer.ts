import { Component, getInstance } from "@reactopus/ioc";
import express from "express";
import * as http from "http";
import { ModuleLoader } from "@reactopus/serve";

@Component("server/http")
export default class HttpServer {
  app: express.Express;
  loader: ModuleLoader;

  async init(loader: ModuleLoader) {
    this.app = express();
    this.loader = loader;
    await this.applyMiddlewares();
  }

  async applyMiddlewares() {
    const manifests = this.loader.getManifests();

    for (const manifest of manifests) {
      if (manifest.routes) {
        for (const [path, value] of Object.entries(manifest.routes)) {
          console.log("ROUTE:", path, value);

          // @ts-ignore
          const handler = getInstance<any>(value);

          this.app.get(path, (req, res) => {
            handler.execute(handler, req, res);
          });
        }
      }
    }
  }

  async start(): Promise<http.Server> {
    console.log("in HttpServer start");

    return this.app.listen(4111, () =>
      console.log(
        `Web server is running on http://${process.env.VIRTUAL_HOST}:4111`
      )
    );
  }
}
