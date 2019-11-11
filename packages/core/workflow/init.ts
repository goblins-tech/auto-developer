import * as tools from "../tools";
import { validate } from "./validate";
import fs from "fs";

console.log("======= init a project =========");

export default function(config: AutoDevConfig) {
  config = tools.object.merge(config, {});

  if (!validate(config))
    throw new Error("== invalid auto-developer config object ==");
  //todo: create the final config (ex: replace builderName with default npm package angular->@goblins-tech/angular-builder)

  // create auto-developer-used.json file in the project's root
  //todo: tools.schematics.write(config.path/config.name/auto-developer-used.json,...)
  fs.writeFile(
    config.path + config.name + "/auto-developer-used.json", //todo: path.join(..)
    config,
    function(err) {
      //todo: path of the new project's root folder, not this project's root
      if (err) return console.error("error:", err);
      console.log("auto-developer-used.json has been created!");
    }
  );
  return config;
}
