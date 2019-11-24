import * as tools from "../tools";
import adaptor from "./adaptor";
import fs from "fs";

console.log("======= init a project =========");

export default function(autoDev: AutoDev, signal = "init") {
  //todo: default autoDev
  autoDev = tools.objects.merge(adaptor(autoDev, signal), {});

  //for new projects (i.e: signal==init), create the final auto-developer-used.js
  //todo: for existing projects, merge the new final auto-developer.js with the existing one
  if (signal == "init") {
    //todo: create the final config (ex: replace builderName with default npm package angular->@goblins-tech/angular-builder)

    // create auto-developer-used.json file in the project's root
    //todo: tools.schematics.write(config.path/config.name/auto-developer-used.json,...)
    let config = autoDev.config;
    if (!fs.existsSync(config.path))
      fs.mkdirSync(config.path, { recursive: true });

    fs.writeFile(
      config.path + "auto-developer-used.json", //todo: path.join(..)
      JSON.stringify(autoDev, null, 2),
      function(err) {
        //todo: path of the new project's root folder, not this project's root
        if (err) return console.error("error:", err.message);
        console.log("auto-developer-used.json has been created!");
      }
    );
  }

  return autoDev;
}
