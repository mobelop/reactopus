import {ModuleLoader} from "./ModuleLoader";
import {getInstance} from "@reactopus/ioc";
import HttpServer from "@reactopus/core-modules/modules/http/components/HttpServer";

export class Serve {

    constructor() {

    }

    async start() {
        console.log("starting server");

        const loader = new ModuleLoader();
        loader.load();

        const server = getInstance<HttpServer>("server/http");
        await server.init(loader);
        await server.start();
    }
}
