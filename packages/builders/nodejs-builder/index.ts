import * as tools from "@goblins-tech/auto-developer/tools";

export default function(
  options,
  signal = "init",
  tree: tools.Tree,
  context: tools.SchematicContext
): tools.Rule {
  if (signal == "init") return init(options, tree, context);
  //todo: other signals
}

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

function init(options, tree, context) {
  //merge the default values into the provided options
  let defaultInitOptions = {
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
  options = tools.objects.merge(options, defaultInitOptions, true);
  if (options.scope) {
    options.name = options.scope + "/" + options.name;
    delete options.scope;
  }

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
  dependencies = dependencies || {};
  devDependencies = devDependencies || {};
  //to add more files (or modify an existing file) use files-builder=> [{fileName:content}]

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

    if (!("typescript" in devDependencies)) devDependencies.typescript = "";
    if (!("tslint" in devDependencies)) devDependencies.tslint = "";
    if (!("tslib" in devDependencies)) devDependencies.tslib = "";
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
    "./templates/init",
    path,
    {
      opt,
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
}
