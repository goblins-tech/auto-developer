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

//todo: pass the Tree from the previous builder, and also pass autoDeveloper.json
export function init(options: InitOptions): Rule {
  if (!options.name)
    throw new tools.schematics.SchematicsException(
      "project's name is required"
    );

  //todo: check if the files already exists and offer options to:
  //override, ignore, mergeTo, mergeFrom

  return (tree: Tree, context: SchematicContext) => {
    if (!path) path = "/"; //just for typescript
    path = tools.normalize(path);

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
      description: "created by `autoDeveloper` goblinsTech.com/autoDeveloper",
      main: "index.js",
      scripts: {},
      repository: {
        type: "",
        url: ""
      },
      keywords: ["autoDeveloper"],
      license: "MIT",
      dependencies: {},
      devDependencies: {}
    };

    var {
      ts,
      gitignore,
      npmignore,
      readMe,
      path, //project's path (not a part of package.json)
      autoDeveloper, //autoDeveloper elements, such as: config, tree, autoDeveloper(i.e autoDeveloper.json data),...
      ...opt
    } = options;
    //to add more files (or modify an existing file) use files-builder=> [{fileName:content}]

    //todo: check it the parameter 'options' changes the global var 'options'
    opt = tools.merge(opt, defaultPkg, true);
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
      ts = tools.merge(ts, defaultTs, true);
    }

    if (gitignore instanceof Array) gitignore = gitignore.join("\n");
    if (npmignore instanceof Array) npmignore = npmignore.join("\n");

    //adjust the options
    opt.keywords = opt.keywords || ["autoDeveloper", "test"];
    if (!opt.keywords.includes("autoDeveloper"))
      opt.keywords.unshift("autoDeveloper");
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

    opt.name = tools.strings.dasherize(opt.name);

    if (opt.author instanceof Object) {
      //[] is also an instanceof Object, but we don't need to check because author here is {} or string
      opt.author =
        (opt.author ? opt.author.name : "") +
        (opt.author && opt.author.name ? " <" + opt.author.email + ">" : "") +
        (opt.author && opt.author.url ? " (" + opt.author.url + ")" : "");
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

    opt = Object.assign(opt, test);

    //take the files from './files' and apply templating (on path and content)
    // of each file

    return tools.template(
      "./files", //related to dist/**, not to this file, todo: use tsConfig.paths{}
      path,
      {
        opt, //opt: options,
        ts,
        gitignore,
        npmignore,
        readMe /*,...tools.strings*/
      },
      //todo: TypeError: Cannot use 'in' operator to search for 'Symbol(schematic-tree)' in true
      filePath =>
        (filePath != "tsconfig.json" || ts != null) &&
        (filePath != ".npmignore" || npmignore != null) &&
        (filePath != ".gitignore" || gitignore != null) &&
        (filePath != "README.md" || readMe != null),
      true
    );
  };

  //todo: add @angular-devkit/schematics (and all packages used by this builder) to devDependencies
  //autoDeveloper is responible of installing all packages it uses before working with autoDeveloper.json
  //todo: offer to install prettier (via prettier-builder), tslint (via tslint-builder) or (code-formatter-builder)
}
