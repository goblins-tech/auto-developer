import { argv } from "process";
import * as tools from "../tools";

const args = require("minimist")(argv.slice(2));

//add a new hook ex: hook(install,(builder,options)=>console.log("installing"+builder),"pre")
export function hook(fn, exec, place = "pre") {}

export function exec(
  builder: Builder,
  tree: tools.Tree,
  context: tools.SchematicContext
): tools.Rule {
  if (typeof builder[0] == "string") builder[0] = require(builder[0]);
  return builder[0](options, builder[2].signal, tree, context);
}

export function install(builder: Builder) {
  if (builde[2].manager == "npm") tools.process.npm(`i ${builder[0]}`);
}
