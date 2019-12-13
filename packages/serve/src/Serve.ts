import { HttpServer } from "@reactopus/core-modules";
import { getInstance } from "@reactopus/ioc";
import { ModuleLoader } from "./ModuleLoader";

export class Serve {
  public async start() {
    const loader = new ModuleLoader();
    loader.load();

    const server = getInstance<HttpServer>("server/http");
    await server.init(loader);
    await server.start();
  }
}
