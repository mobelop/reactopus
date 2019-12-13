import { ComponentPlugin } from "@reactopus/ioc";

@ComponentPlugin("test-app/comp1/Component1")
export default class Component1Plugin {
  beforeTestMethod() {
    console.log("in PLUGIN!");
  }
}
