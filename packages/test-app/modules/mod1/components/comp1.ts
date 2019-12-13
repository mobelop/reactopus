import { Component } from "@reactopus/ioc";

@Component("test-app/comp1/Component1")
export default class Component1 {
  testMethod() {
    console.log("in test method");
  }
}
