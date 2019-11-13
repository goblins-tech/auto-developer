import * as tools from "../tools";
import validate from "./validate";
import fs from "fs";

console.log("======= init a project =========");

export default function(autoDev: AutoDev) {
  autoDev = tools.objects.merge(validate(autoDev), {});

  //todo: create the final config (ex: replace builderName with default npm package angular->@goblins-tech/angular-builder)

  // create auto-developer-used.json file in the project's root
  //todo: tools.schematics.write(config.path/config.name/auto-developer-used.json,...)
  let config = autoDev.config;
  fs.writeFile(
    config.path + config.name + "/auto-developer-used.json", //todo: path.join(..)
    JSON.stringify(autoDev, null, 2),
    function(err) {
      //todo: path of the new project's root folder, not this project's root
      if (err) return console.error("error:", err);
      console.log("auto-developer-used.json has been created!");
    }
  );
  return autoDev;
}
