/*
todo:
- the workflow plan will be different for every signal (i.e: init, update, test, e2e, ...)
- >dv $signal $name* $path --options
 */
import * as rn from "./runner";
import * as tools from "../tools";
import * as fs from "fs";

export default function(autoDev: AutoDev, signal = "init") {
  var plan: Plan[] = [],
    install = [],
    exec = [];

  autoDev.builders.forEach(builder => {
    if (!(builder instanceof Array)) builder = [builder, {}, {}];

    //merge options (add name,path), config(override some configs just for this builder)
    if ("signal" in builder[2]) delete builder[2].signal;
    let config = tools.objects.merge(builder[2], autoDev.config, true);
    builder = [
      builder[0],
      tools.objects.merge(
        builder[1],
        {
          name: config.name,
          path: config.path
        },
        false
      ),
      config
    ];

    if (typeof builder == "string") {
      if (!builder.startsWith(".")) inatall.push(["install", builder]);
      else {
        if (!fs.exists(builder[0]))
          throw new tools.SchematicsException(
            `Error: path not found ${builder[0]}`
          );
        else if (fs.lstatSync(builder[0]).isDirectory()) {
          builder[0] = null; //todo: path to package.json/main or index.js
        }
      }
    }

    exec.push("exec", builder);
  });

  return plan; //todo: every result from exec() [i.e: Tree| Rule] must be passed to the next exec()
}
