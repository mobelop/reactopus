import { registry, pluginContext, components } from "./registry";

export function Component(component: string) {
  const rewriteMethods = (constructor: Function) => {
    // has a plugin?
    if (registry[component]) {
      const plugins = registry[component];
      const methods = Object.keys(constructor.prototype);
      const overrideMap = {};

      for (const plugin of plugins) {
        for (const method of methods) {
          const original = constructor.prototype[method];
          const name = method[0].toUpperCase() + method.substr(1);

          if (
            !overrideMap[name] &&
            (plugin["before" + name] ||
              plugin["after" + name] ||
              plugin["around" + name])
          ) {
            overrideMap[name] = true;

            // console.log("override", method);
            constructor.prototype[method] = function() {
              // @ts-ignore
              for (const plugin of plugins) {
                plugin["before" + name] &&
                  plugin["before" + name].apply(pluginContext[component], [
                    this,
                    // @ts-ignore
                    ...arguments
                  ]);
              }

              // @ts-ignore
              let result = undefined;
              let hasAroundPlugin = false;
              for (const plugin of plugins) {
                if (plugin["around" + name]) {
                  hasAroundPlugin = true;
                  result = plugin["around" + name].apply(
                    pluginContext[component],
                    [
                      this,
                      original,
                      // @ts-ignore
                      arguments
                    ]
                  );
                }
              }

              if (!hasAroundPlugin) {
                result = original.apply(this, arguments);
              }

              // @ts-ignore
              for (const plugin of plugins) {
                plugin["after" + name] &&
                  plugin["after" + name].apply(pluginContext[component], [
                    this,
                    result,
                    // @ts-ignore
                    ...arguments
                  ]);
              }

              return result;
            };
          }
        }
      }
    }
  };

  return function(constructor: Function) {
    rewriteMethods(constructor);
    components[component] = constructor;
  };
}
