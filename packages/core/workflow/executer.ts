import { argv } from "process";
import * as tools from "../tools";

const args = require("minimist")(argv.slice(2));

export function exec(builder: string, options) {
  //merge options from CLI into options from `project plan`  (autoDev.js)
  options = tools.objects.merge(args, options, false); //todo: remove schematics options (ex: --force --dry-run)
  [builder, cmd] = builder.split(":");
  return tools.externalSchematics(builder, cmd, options);
}
