import { ComponentPlugin } from "@reactopus/ioc";

@ComponentPlugin("server/http")
export default class StaticAssetsPlugin {
    beforeApplyMiddlewares() {
        console.log('STATIC ASSETS!')
    }
}
