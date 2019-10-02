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
  author?: string | { name: string; email: string; url: string };
  repository?: string | { url: string; type: string };
  repo?: string | { url: string; type: string };
  homepage?: string;
  bugs?: string;
  dependencies?: string[] | { string: string };
  devDependencies?: string[] | { string: string };
  ts?: {};
  gitignore?: {};
  npmignore?: {};
  readMe?: string;
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

    let defaultPkg = {
        name: "",
        version: "1.0.0",
        private: false,
        description: "created by `The Creator` the-creator.com",
        main: "index.js",
        scripts: {},
        repository: {
          type: "",
          url: ""
        },
        keywords: ["the-creator"],
        license: "MIT",
        dependencies: {},
        devDependencies: {}
      },
      defaultTs = {};

    let ts = options.ts,
      gitignore = options.gitignore,
      npm = options.npmignore,
      readMe = options.readMe;

    delete options.ts;
    delete options.gitignore;
    delete options.npmignore;
    delete options.readMe;

    options = Object.assign(defaultPkg, options);
    ts = Object.assign(defaultTs, ts);

    //adjust the options
    options.keywords = options.keywords || ["the-creator", "test"];
    if (!options.keywords.includes("the-creator"))
      options.keywords.unshift("the-creator");
    //console.log("keywords", options.keywords);

    if (!options.repository) options.repository = options.repo;
    delete options.repo;

    //todo: repo may be a string i.e: "type:url" ex: "github:flaviocopes/testing"
    if (
      !options.bugs &&
      options.repository &&
      options.repository.url &&
      options.repository.type == "git"
    ) {
      options.bugs = options.repository.url + "/issues";
    }

    options.name = dasherize(options.name);

    if (options.author instanceof Object) {
      //[] is also an instanceof Object, but we don't need to check because author here is {} or string
      options.author =
        (options.author ? options.author.name : "") +
        (options.author && options.author.name
          ? " <" + options.author.email + ">"
          : "") +
        (options.author && options.author.url
          ? " (" + options.author.url + ")"
          : "");
    }

    //todo: dependencies: [mydep@1.0.0] => {mydep:1.0.0}, [mydep] => {mydep:""}

    //tmp, just for tests
    let test = {
      author = {
        name: "aName",
        email: "author@gmail.com",
        url: "http://author.com"
      },
      scripts = {
        build: "npm run build",
        test: "npm run test"
      }
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
