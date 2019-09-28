import {
  Rule,
  Tree,
  SchematicContext,
  SchematicsException,
  apply,
  template,
  url,
  move,
  chain,
  branchAndMerge,
  mergeWith
  /*
  MergeStrategy,
  ,
  ,
*/
} from "@angular-devkit/schematics";

import { strings, normalize } from "@angular-devkit/core";

//returns a Schematics Rule to initiate the workspace
//'main' schematic function, todo: rename to main()?
export interface initOptions {
  name: "string";
  path?: string;
}

//todo: pass the Tree from the previous builder, and also pass creator.json
export function init(options: initOptions): Rule {
  if (!options.name)
    throw new SchematicsException("project's name is required");

  //todo: check if the files already exists and offer options to:
  //override, ignore, mergeTo, mergeFrom

  return (tree: Tree, context: SchematicContext) => {
    options.path = normalize(options.path);

    /*
    //ex: create a file
    tree.create("hello.ts", 'console.log("Hello, World")');
    return tree;
     */

    //take the files from './files' and apply templating (on path and content)
    // of each file
    let tmpl = apply(url("./files"), [
      template({ ...strings, ...options }),
      move(options.path)
    ]);
    return chain([branchAndMerge(chain([mergeWith(tmpl)]))]);
    //or: mergeWith(templateSource, MergeStrategy.Overwrite);
  };
}
