/*
todo:
make every builders/$builderName/package.json inhirits from builders/package.json
 */

//import * as tools from "../../tools"; //todo: copy core/tools/ to every package/builders
import * as tools from "@goblins-tech/auto-developer/tools"; //`npm pack` or `npm link`

//returns a Schematics Rule to initiate the workspace
//'main' schematic function, todo: rename to main()?
export interface InitOptions {
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
  [key: string]: any; //add arbitrary data to package.json, to create or modify other files use files-builder builder
}

//todo: pass the Tree from the previous builder, and also pass auto-developer.js
export function init(options: InitOptions): tools.Rule {
  if (!options.name)
    throw new tools.SchematicsException("project's name is required");

  //todo: check if the files already exists and offer options to:
  //override, ignore, mergeTo, mergeFrom

  return (tree: tools.Tree, context: tools.SchematicContext) => {
    if (!path) path = "/"; //just for typescript
    path = tools.objects.normalize(path);

    //console.log("tree", tree);
    //console.log("context", context);
    /*
    //ex: create a file
    tree.create("hello.ts", 'console.log("Hello, World")');
    return tree;
     */

    let defaultPkg = {
      name: "",
      version: "1.0.0",
      private: false,
      description: "created by `auto-developer` goblinsTech.com/auto-developer",
      main: "index.js",
      scripts: { build: "tsc -w" },
      repository: {
        type: "",
        url: ""
      },
      keywords: ["auto-developer builder"],
      license: "MIT",
      dependencies: {},
      devDependencies: {},
      author: {
        name: "",
        email: "",
        url: ""
      }
    };

    var {
      ts,
      tslint,
      gitignore,
      npmignore,
      readMe,
      path, //project's path (not a part of package.json)
      autoDeveloper, //autoDeveloper elements, such as: config, tree, autoDeveloper(i.e auto-developer.js data),...
      dependencies,
      devDependencies,
      ...opt
    } = options;
    //to add more files (or modify an existing file) use files-builder=> [{fileName:content}]

    //todo: check it the parameter 'options' changes the global var 'options'
    opt = tools.objects.merge(opt, defaultPkg, true);
    if (ts !== null) {
      //the user may dosen't want to use typescript
      ts = tools.objects.merge(
        ts,
        {
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
        },
        true
      );
      tslint = tools.objects.merge(
        tslint,
        {
          extends: "tslint:recommended",
          //rules: https://palantir.github.io/tslint/rules/
          rules: {
            "member-ordering": [
              true,
              {
                order: [
                  "static-field",
                  "instance-field",
                  "static-method",
                  "instance-method"
                ]
              }
            ]
          },
          rulesDirectory: ["codelyzer"] //https://palantir.github.io/tslint/usage/configuration/
        },
        true
      );

      dependencies = dependencies || {};
      devDependencies = devDependencies || {};

      if (!("tslib" in dependencies)) dependencies.tslib = "";

      if (!("typescript" in devDependencies)) devDependencies.typescript = "";
      if (!("tslint" in devDependencies)) devDependencies.tslint = "";
      if (!("ts-node" in devDependencies)) devDependencies["ts-node"] = "";
      if (!("@types/node" in devDependencies))
        devDependencies["@types/node"] = "";
      if (
        !("codelyzer" in devDependencies) &&
        "rulesDirectory" in tslint &&
        "codelyzer" in tslint.rulesDirectory
      )
        devDependencies.codelyzer = "";
      //todo: foreach(tslint.rulesDirectory as rule)devDependencies[rule]=""; only if not a path ex: ./dir
    }

    if (gitignore instanceof Array) gitignore = gitignore.join("\n");
    if (npmignore instanceof Array) npmignore = npmignore.join("\n");

    //adjust the options
    opt.keywords = opt.keywords || ["auto-developer"];
    if (!opt.keywords.includes("auto-developer"))
      opt.keywords.unshift("auto-developer");
    //console.log("keywords", options.keywords);

    if (!opt.repository) opt.repository = opt.repo;
    delete opt.repo;

    //todo: repo may be a string i.e: "type:url" ex: "github:flaviocopes/testing"
    if (
      !opt.bugs &&
      opt.repository &&
      opt.repository.url &&
      opt.repository.type == "git"
    )
      opt.bugs = opt.repository.url + "/issues";

    opt.name = tools.objects.strings.dasherize(opt.name);

    if (opt.author instanceof Object) {
      //[] is also an instanceof Object, but we don't need to check because author here is {} or string
      opt.author =
        (opt.author ? opt.author.name : "") +
        (opt.author && opt.author.name ? " <" + opt.author.email + ">" : "") +
        (opt.author && opt.author.url ? " (" + opt.author.url + ")" : "");
    }

    //todo: dependencies: [mydep@1.0.0] => {mydep:1.0.0}, [mydep] => {mydep:""}

    //take the files from './files' and apply templating (on path and content)
    // of each file

    return tools.Template(
      "./files", //related to dist/**, not to this file, todo: use tsConfig.paths{}
      path,
      {
        opt, //opt: options,
        ts,
        tslint,
        gitignore,
        npmignore,
        readMe /*,...tools.objects.strings*/
      },
      //todo: TypeError: Cannot use 'in' operator to search for 'Symbol(schematic-tree)' in true
      filePath =>
        ((filePath != "tsconfig.json" && filePath != "tslint.json") ||
          ts != null) &&
        (filePath != ".npmignore" || npmignore != null) &&
        (filePath != ".gitignore" || gitignore != null) &&
        (filePath != "README.md" || readMe != null),
      true
    );
  };

  //todo: add @angular-devkit/schematics (and all packages used by this builder) to devDependencies
  //auto-developer is responible of installing all packages it uses before working with auto-developer.js
  //todo: offer to install prettier (via prettier-builder), tslint (via tslint-builder) or (code-formatter-builder)
}
