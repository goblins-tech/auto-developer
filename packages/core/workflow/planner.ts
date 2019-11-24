/*
todo:
- the workflow plan will be different for every signal (i.e: init, update, test, e2e, ...)
- >dv $signal $name* $path --options
 */
import * as rn from "./runner";
import * as tools from "../tools";

export default function(autoDev: AutoDev, signal = "init") {
  var install = [],
    exec = [];

  autoDev.builders.forEach(builder => {
    if (builder.type == "package") install.push(["install", builder]);
    exec.push(["exec", builder]);
  });

  var plan: Plan = [...install, ...exec]; //or: install.concat(exec)
  return plan; //todo: every result from exec() [i.e: Tree| Rule] must be passed to the next exec()
}
