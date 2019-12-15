import * as fs from "fs";
import path from "path";
import { AppConfig } from "./AppConfig";

interface IRoute {
  [path: string]: string;
}

interface IManifest {
  routes?: IRoute[];
}

export class ModuleLoader {
  public rootDirs: string[];
  public manifests: IManifest[];

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
      path.join(path.dirname(require.resolve("@reactopus/graphql")), "modules"),
      path.join(path.dirname(require.resolve("@reactopus/auth")), "modules")
    ];
  }

  public getManifests(): IManifest[] {
    return this.manifests;
  }

  public load() {
    const coreModules = ["graphql-server", "react-ssr", "http"];
    const modules = [...coreModules, ...AppConfig.get("modules", [])];

    for (const modName of modules) {
      for (const rootDir of this.rootDirs) {
        try {
          const fullPath = require.resolve(
            path.join(rootDir, modName, "manifest.json")
          );
          this.loadModule(fullPath);
        } catch (e) {
          // ignore
        }
      }
    }
  }

  public loadModule(manifestPath: string) {
    const manifest = require(manifestPath);
    const modulePath = path.dirname(manifestPath);
    const componentsDir = path.join(modulePath, "components");

    this.manifests.push(manifest);

    if (fs.existsSync(componentsDir)) {
      const components = fs.readdirSync(componentsDir);
      // plugins first
      for (const componentFile of components) {
        if (componentFile.includes("Plugin")) {
          require(path.join(componentsDir, componentFile));
        }
      }

      for (const componentFile of components) {
        if (componentFile.includes("Plugin")) {
          continue;
        }
        require(path.join(componentsDir, componentFile));
      }
    }
  }
}
