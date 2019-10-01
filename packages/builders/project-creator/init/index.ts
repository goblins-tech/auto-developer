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
  name: string;
  path?: string;
  keywords?: string[];
  author?: { name: string; email: string; url: string };
  repo?: string | { url: string; type: string };
  urls?: { home: string; bugs: string };
  dependencies?: string[] | { string: string };
  devDependencies?: string[] | { string: string };
}

//todo: pass the Tree from the previous builder, and also pass creator.json
export function init(options: initOptions): Rule {
  if (!options.name)
    throw new SchematicsException("project's name is required");

  //todo: check if the files already exists and offer options to:
  //override, ignore, mergeTo, mergeFrom

  return (tree: Tree, context: SchematicContext) => {
    if (!options.path) options.path = "/"; //just for typescript
    options.path = normalize(options.path);

    /*
    //ex: create a file
    tree.create("hello.ts", 'console.log("Hello, World")');
    return tree;
     */

    //adjust the options
    options.keywords = options.keywords || ["the-creator", "test"];
    if (!options.keywords.includes("the-creator"))
      options.keywords.unshift("the-creator");
    //console.log("keywords", options.keywords);

    //todo: repo may be a string i.e: "type:url" ex: "github:flaviocopes/testing"
    if (options.urls && !options.urls.bugs) {
      if (options.repo.type == "git" && options.repo.url)
        options.urls.bugs = options.repo.url + "/issues";
    }

    //todo: dependencies: [mydep@1.0.0] => {mydep:1.0.0}, [mydep] => {mydep:""}

    //tmp, just for tests

    options.author = {
      name: "aName",
      email: "author@gmail.com",
      url: "http://author.com"
    };

    options.scripts = {
      build: "npm run build",
      test: "npm run test"
    };

    //take the files from './files' and apply templating (on path and content)
    // of each file

    //todo: url("./files") will read ./files related to 'dist', not related to this files
    let tmpl = apply(
      url("../../../../../packages/builders/project-creator/init/files"),
      [template({ ...strings, opt: options }), move(options.path)]
    );

    return chain([branchAndMerge(chain([mergeWith(tmpl)]))]);
    //or: mergeWith(templateSource, MergeStrategy.Overwrite);
  };
}
