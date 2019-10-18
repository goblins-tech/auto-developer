import { init } from "./init/";
import {Rule,schematic, chain} from "@angular-devkit/schematics";

export default function(options, cmd = "init"): Rule {
  if (cmd === "init") {
  //  return init(options);
    //return schematic('init',options)
    return chain([schematic('init',options)]) //RULE

    //for external schematics: externalSchematic('@schematics/angular', 'application', options)
  }
}
