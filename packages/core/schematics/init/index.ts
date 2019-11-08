/*
use this schematics to init a new project, send :init signal to all builders
*/

import * as WF from "../workflow";
import * as tools from "../tools";

export interface AutoDevOptions {}

export default function(config: AutoDevOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    //todo: add config.path, config.name to options of every builder
    //todo: return chain([externalSchematic(builder1,"init",options),...])
    return tree;
  };
}
