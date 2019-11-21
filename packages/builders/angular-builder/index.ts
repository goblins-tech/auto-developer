import * as tools from "@goblins-tech/auto-developer/tools";
import fs from "fs";
import generate from "./generate";

export default function(
  options,
  signal = "init",
  tree: tools.Tree,
  context: tools.SchematicContext
) {
  if (signal == "init") return init(options, tree, context);
  //todo: other signals
}

export interface InitOptions {
  path?: string;
  version?: string | number;
  spec?: boolean; //add spec files when generating components,...
  e2e?: boolean;
  generate: GenerateOptions;
  universal: UniversalOptions; //via express-builder:init
  material: MaterialOptions; //via material-builder:init {front-end=Angular}
  karma: KarmaOptions; //override karma-builder options
  config: {
    apps; //:AppOptions
    libs; //:LibOptions;
    modules; //:ModuleOptions;
    components; //:ComponentOptions;
  };
}

export interface GenerateOptions {
  [key: string]: string | [string | { name: string; [key: string]: any }];
  //ex: generate:{ apps:["app1", {name:"app2"}] } or generate:{apps:"app1"} or generate:{apps:{name:"app1"}}
  /*
  todo:
  for apps: main app = app[0]
  for components: if(!module)use modules[0]; if(!exists(module))generate it
   */
}

//todo: import from generate/$part/index
export interface UniversalOptions {}
export interface MaterialOptions {}
export interface KarmaOptions {}

export interface MaterialOptions {
  theme: "purble" | MaterialThemeCustom;
  animations: boolean;
  //also install hammerjs, moment
}
export interface MaterialThemeCustom {}

export interface KarmaOptions {
  //todo: import `ts difinitions` from karma
  frameworks?: string;
}

export interface UniversalOptions {}

let defaultMaterialOptions = {
  theme: "purble",
  animations: true
};

function init(options, tree, context) {
  /*
  todo:
   - tslint: (via project-builder)
      "import-blacklist": [true, "rxjs/Rx"],

  - todo: check if the files already exists and offer options to:
    override, ignore, mergeTo, mergeFrom

  - add to tsconfig (top level):
        "angularCompilerOptions": {
          "fullTemplateTypeCheck": true,
          "strictInjectionParameters": true
        }

  - when creating a component, add it's routes to the module
   */

  if (tree.exists("angular.js"))
    tools.SchematicsException("this is an existing Angular project");
  let defaultInitOptions = {
    path: `/${options.name}`,
    generate: {
      app: ["app"]
    },
    version: "latest", //8
    spec: false,
    e2e: false,
    src: "src",
    dist: "dist/angular",
    readMe: "", //add readMe to #Angular-builder section
    tsConfigApp: {
      extends: "./tsconfig.json",
      compilerOptions: {
        outDir: "", //todo: using this?? i.e:  outDir:this.dist/angular
        types: []
      },
      files: ["src/main.ts", "src/polyfills.ts"],
      include: ["src/**/*.ts"],
      exclude: ["src/test.ts", "src/**/*.spec.ts"]
    },
    tsConfigSpec: {
      extends: "./tsconfig.json",
      compilerOptions: {
        outDir: "./out-tsc/spec",
        types: ["jasmine", "node"]
      },
      files: ["src/test.ts", "src/polyfills.ts"],
      include: ["src/**/*.spec.ts", "src/**/*.d.ts"]
    }
  };
  defaultInitOptions.tsConfigApp.outDir = `${defaultInitOptions.dist}/angular`;

  options = tools.objects.merge(options, defaultInitOptions, true);
  options.path = tools.objects.normalize(options.path);
  if (options.version == "latest") options.version = 8;
  options.baseVersion = options.version; //todo: baseVersion=floor(opt.version), then modify the template based on the selected version
  options.mainApp = options.generate!.app![0]; //todo: review

  /* todo: check if the version is supported
     console.log(
       "baseVersion",
       options.baseVersion,
       tools.objects.normalize(
         `../../../../../packages/builders/angular-builder/init/files/v${options.baseVersion}`
       )
     );
     if (
       !fs.existsSync(
         `../../../../../packages/builders/angular-builder/init/files/v${options.baseVersion}`
       )
     )
       throw new tools.SchematicsException("this version is not supported");
     //todo: select from the available versions
     */

  let rules = [
    tools.Template(
      `./templates/init/v${options.baseVersion}`,
      options.path,
      { opt: options },
      null, //path => !path.includes("[apps]"),
      true
    ),
    tools.dependencies(options.path, {
      "@angular/animations": "~8.2.9",
      "@angular/common": "~8.2.9",
      "@angular/compiler": "~8.2.9",
      "@angular/core": "~8.2.9",
      "@angular/forms": "~8.2.9",
      "@angular/platform-browser": "~8.2.9",
      "@angular/platform-browser-dynamic": "~8.2.9",
      "@angular/router": "~8.2.9",
      rxjs: "~6.4.0",
      "zone.js": "~0.9.1",
      tslib: "^1.10.0"
    }),
    tools.dependencies(
      options.path,
      {
        "@angular-devkit/build-angular": "~0.803.8",
        "@angular/cli": "~8.3.8",
        "@angular/compiler-cli": "~8.2.9",
        "@angular/language-service": "~8.2.9",

        //override versions used in nodejs-builder with versions that compitable with angular version
        "@types/node": "~8.9.4",
        "@types/jasmine": "~3.3.8",
        "@types/jasminewd2": "~2.0.3",
        codelyzer: "^5.0.0",
        "jasmine-core": "~3.4.0",
        "jasmine-spec-reporter": "~4.2.1",
        karma: "~4.1.0",
        "karma-chrome-launcher": "~2.2.0",
        "karma-coverage-istanbul-reporter": "~2.0.1",
        "karma-jasmine": "~2.0.1",
        "karma-jasmine-html-reporter": "^1.4.0",
        protractor: "~5.4.0",
        tslint: "~5.15.0",
        typescript: "~3.5.3",
        "ts-node": "~7.0.0"
      },
      "dev"
    ),
    tools.json.write(
      `${options.path}/karma.conf.js`,
      tools.objects.merge(options.karma, {
        basePath: "",
        frameworks: ["@angular-devkit/build-angular"], //todo: merge arrays to the existing arrays, don't replace
        plugins: [
          //  require("@angular-devkit/build-angular/plugins/karma")
        ]
      })
    )
  ];

  //also support `generate` from CLI ex: > schematics .:init --app=myApp
  //todo: support ng-generate
  //todo: all generate parts (app, lib, ...)
  ["app", "lib"].forEach(part => {
    if (part in options) {
      if (!(part in options.generate)) options.generate[part] = [];
      options.generate[part].push(options[part]);
    }
  });

  if (options.generate) {
    //todo: plugins can register other parts to generate
    //adjaust data to: [{name:app1}, {name:app2}]
    //possible formats: "app", {name: "app"}, ["app1",{name:"app2"}]

    for (let part in options.generate) {
      let partData = options.generate[part],
        type = tools.objects.objectType(partData);
      if (type == "string") partData = [{ name: partData }];
      else if (type == "object") partData = [partData];
      //apply scematics
      partData.forEach(item => {
        if (tools.objects.objectType(item) === "string") item = { name: item };
        if (part.endsWith("s")) part = part.slice(0, -1);
        item.path = item.path || options.path;
        item.version = item.version || options.version;
        //rules.push(tools.schematic(part, item)); //todo: schematic(`generate-${singular(part)}`,...) i.e: convert apps to app
        //tree = generate(part, item, tree, context); //will not generate templates/generate/**
        rules.push(generate(part, item, tree, context));
        //todo: or: item["__part"] = part; schematic('generate', item)
      });
    }
  }

  return tools.mergeTemplate(rules);
}
