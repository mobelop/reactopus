import config from "config";

export const AppConfig = {
  get(key: string, defaultValue: any = undefined) {
    return config.has(key) ? config.get(key) : defaultValue;
  }
};
