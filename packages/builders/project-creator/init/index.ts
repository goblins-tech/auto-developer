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

import { strings } from "@angular-devkit/core";

//returns a Schematics Rule to initiate the workspace
//'main' schematic function, todo: rename to main()?
export interface initOptions {
  name: "string";
  path?: string;
}
export function init(
  creator: any /*creator:Creator*/,
  options: initOptions
): Rule {
  if (!options.name)
    throw new SchematicsException("project's name is required");

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
    return chain([branchAndMerge(chain(mergeWith(tmpl)))]);
    //or: mergeWith(templateSource, MergeStrategy.Overwrite);
  };
}
