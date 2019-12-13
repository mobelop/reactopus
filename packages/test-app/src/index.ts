import { Serve, AppConfig } from "@reactopus/serve";
import { getInstance } from "@reactopus/ioc";
import Component1 from "../modules/mod1/components/comp1";

console.log("test", AppConfig.get("web.url"));

const serve = new Serve();
serve.start();
