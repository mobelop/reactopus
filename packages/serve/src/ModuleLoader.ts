import { AppConfig } from "./AppConfig";
import path from "path";
import * as fs from "fs";

interface Route {
  [path: string]: string;
}

interface Manifest {
  routes?: Route[];
}

export class ModuleLoader {
  rootDirs: string[];
  manifests: Manifest[];

  constructor() {
    const reactopusCoreDir = path.resolve(
      path.join(require.resolve("@reactopus/core-modules"), "../")
    );

    this.manifests = [];
    this.rootDirs = [
      path.resolve(process.cwd(), "modules"),
      path.join(
        path.dirname(require.resolve("@reactopus/core-modules")),
        "modules"
      ),
      path.join(path.dirname(require.resolve("@reactopus/graphql")), "modules")
    ];
  }

  getManifests(): Manifest[] {
    return this.manifests;
  }

  load() {
    console.log("loading modules from:", this.rootDirs);

    const coreModules = ["graphql-server", "react-ssr", "http"];
    const modules = [...coreModules, ...AppConfig.get("modules", [])];

    for (const modName of modules) {
      for (const rootDir of this.rootDirs) {
        try {
          const fullPath = require.resolve(
            path.join(rootDir, modName, "manifest.json")
          );
          console.log("loading:", modName, fullPath);
          this.loadModule(fullPath);
        } catch (e) {}
      }
    }
  }

  loadModule(manifestPath: string) {
    const manifest = require(manifestPath);
    const modulePath = path.dirname(manifestPath);
    // console.log("manifest", manifest);
    const componentsDir = path.join(modulePath, "components");

    this.manifests.push(manifest);

    if (fs.existsSync(componentsDir)) {
      const components = fs.readdirSync(componentsDir);
      // console.log("components", components);

      // plugins first
      for (const componentFile of components) {
        if (componentFile.includes("Plugin")) {
          // console.log("-- require plugin:", componentFile);
          require(path.join(componentsDir, componentFile));
        }
      }

      for (const componentFile of components) {
        if (componentFile.includes("Plugin")) continue;

        // console.log("-- require:", componentFile);
        require(path.join(componentsDir, componentFile));
      }
    }
  }
}
