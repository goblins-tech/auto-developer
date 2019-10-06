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
  mergeWith,
  filter
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
  creator: {};
  [key: string]: any;
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

    console.log("tree", tree);
    console.log("context", context);
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
    };

    let ts = options.ts || {},
      gitignore = options.gitignore || "",
      npmignore = options.npmignore || "",
      readMe = options.readMe || "",
      path = options.path, //project's path (not a part of package.json)
      creator = options.creator || {}; //creator elements, such as: config, tree, creator(i.e creator.json data),...

    //to add more files (or modify an existing file) use files-creator=> [{fileName:content}]

    delete options.ts;
    delete options.gitignore;
    delete options.npmignore;
    delete options.readMe;
    delete options.creator;
    delete options.path;

    //todo: check it the parameter 'options' changes the global var 'options'
    function merge(options, defaultOptions: {} | boolean, removeNull = true) {
      if (defaultOptions instanceof Object) {
        //note tat: ([] instanceof Object) also ==true
        options = Object.assign(defaultOptions, options);
      } else removeNull = defaultOptions;

      if (removeNull !== false) {
        for (let k in options) {
          if (options.hasOwnProperty(k) && options[k] === null)
            delete options[k];
        }
        return options;
      }
    }

    options = merge(options, defaultPkg, true);
    if (ts !== null) {
      //the user may dosen't want to create tsconfig.json
      let defaultTs = {
        compileOnSave: false,
        compilerOptions: {
          target: "es6",
          module: "commonjs",
          lib: [],
          declaration: true,
          declarationMap: true,
          sourceMap: true,
          outDir: "./dist",
          removeComments: true,
          noEmit: false,
          noEmitOnError: false,
          importHelpers: true,
          downlevelIteration: true,
          strict: false,
          noImplicitAny: false,
          strictNullChecks: true,
          strictFunctionTypes: true,
          strictBindCallApply: true,
          strictPropertyInitialization: true,
          noImplicitThis: true,
          alwaysStrict: true,
          noUnusedLocals: false,
          noUnusedParameters: false,
          noImplicitReturns: false,
          noFallthroughCasesInSwitch: true,
          moduleResolution: "node",
          baseUrl: "./",
          paths: { "*": ["node_modules/*", "src/types/*"] },
          rootDirs: [],
          typeRoots: ["node_modules/@types"],
          types: [],
          allowSyntheticDefaultImports: true,
          esModuleInterop: true,
          preserveSymlinks: true,
          sourceRoot: "",
          mapRoot: "",
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          locale: "en",
          watch: true
        }
      };
      ts = merge(ts, defaultTs, true);
    }

    if (gitignore instanceof Array) gitignore = gitignore.join("\n");
    if (npmignore instanceof Array) npmignore = npmignore.join("\n");

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
    )
      options.bugs = options.repository.url + "/issues";

    options.name = strings.dasherize(options.name);

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
      author: {
        name: "aName",
        email: "author@gmail.com",
        url: "http://author.com"
      },
      scripts: {
        build: "npm run build",
        test: "npm run test"
      }
    };

    options = Object.assign(options, test);

    //take the files from './files' and apply templating (on path and content)
    // of each file

    //todo: url("./files") will read ./files related to 'dist', not related to this files
    let tmpl = apply(url("../../init/files"), [
      filter(path => {
        if (
          (path == "tsconfig.json" && ts == null) ||
          (path == ".npmignore" && npmignore == null) ||
          (path == ".gitignore" && gitignore == null) ||
          (path == "README.md" && readMe == null)
        )
          return false;
        else return true;
      }),
      template({
        opt: options,
        ts,
        gitignore,
        npmignore,
        readMe /*...strings*/
      }),
      move(path)
    ]);

    return chain([branchAndMerge(chain([mergeWith(tmpl)]))]);
    //or: mergeWith(templateSource, MergeStrategy.Overwrite);
  };

  //todo: add @angular-devkit/schematics (and all packages used by this builder) to devDependencies
  //creator is responible of installing all packages it uses before working with creator.json
}
