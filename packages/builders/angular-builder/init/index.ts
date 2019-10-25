/*
todo:
 */

import * as tools from "@goblins-tech/auto-developer/tools";
import fs from "fs";

export interface InitOptions {
  path?: string;
  version?: string | number;
  spec?: boolean; //add spec files when generating components,...
  e2e?: boolean;
  generate: GenerateOptions;
  universal: UniversalOptions; //via express-builder:init
  material: MaterialOptions; //via material-builder:init {front-end=Angular}
  karma: KarmaOptions;
  config: {
    apps: AppOptions;
    libs: LibOptions;
    modules: ModuleOptions;
    components: ComponentOptions;
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
export interface AppOptions {}
export interface UniversalOptions {}
export interface MaterialOptions {}
export interface KarmaOptions {}
export interface LibOptions {}
export interface ModuleOptions {}
export interface ComponentOptions {}

export default function(options: InitOptions): Rule {
  //todo: check if the files already exists and offer options to:
  //override, ignore, mergeTo, mergeFrom

  return (tree: Tree, context: SchematicContext) => {
    if (tree.exists("angular.js"))
      tools.SchematicsException("this is an existing Angular project");
    let defaultInitOptions = {
      path: "/",
      apps: ["app"],
      libs: [],
      version: "latest", //8
      spec: false,
      e2e: false,
      src: "src",
      dist: "dist/angular",
      readMe: "", //add readMe to #Angular-builder section
      tsConfigApp: {
        extends: "./tsconfig.json",
        compilerOptions: {
          outDir: `${this.dist}/angular`,
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

    options = tools.mergeOptions(options, defaultInitOptions, true);
    options.path = tools.normalize(options.path);
    if (options.version == "latest") options.version = 8;
    options.baseVersion = options.version; //todo: baseVersion=floor(opt.version), then modify the template based on the selected version

    /* todo: check if the version is supported
    console.log(
      "baseVersion",
      options.baseVersion,
      tools.normalize(
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

    //todo: add to the existing package.json, select the compitable versions with the current angular version
    let dependencies = {
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
        tslib: "^1.10.0" //todo typescript
      },
      devDependencies = {
        "@angular-devkit/build-angular": "~0.803.8",
        "@angular/cli": "~8.3.8",
        "@angular/compiler-cli": "~8.2.9",
        "@angular/language-service": "~8.2.9",

        //todo: move to custom builders (ex: karma-builder, code-formatter-builder)
        "@types/node": "~8.9.4", //project-builder
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
        typescript: "~3.5.3", //todo: move to project-builder (if(opt.ts!=null))
        "ts-node": "~7.0.0"
      };

    let rules = [
      tools.template(
        `./files/v${options.baseVersion}`,
        { opt: options },
        null, //path => !path.includes("[apps]"),
        options.path,
        false
      )
    ];

    if (options.generate) {
      //todo: plugins can register other parts to generate
      //adjaust data to: [{name:app1}, {name:app2}]
      //possible formats: "app", {name: "app"}, ["app1",{name:"app2"}]
      for (let k in options.generate) {
        let partOptions = options.generate[k],
          type = objectType(partOptions);
        if (type == "string") partOptions = [{ name: partOptions }];
        else if (type == "object") partOptions = [partOptions];
        //apply scematics
        for (let i = 0; i < data.length; i++) {
          if (objectType(data[i]) === "string")
            partOptions[i] = { name: partOptions[i] };
          rules.push(schematic(`generate-${k}`, partOptions));
        }
      }
    }

    return tools.mergeTemplate(rules);
  };
}

/* todo:
- add to tsconfig (top level):
    "angularCompilerOptions": {
      "fullTemplateTypeCheck": true,
      "strictInjectionParameters": true
    }

- foreach(app){ send n, opt &  replace __opt.app[n]....__ && move apps content to src/}

- when creating a component, add it's routes to the module


*/

/*
//todo: move to material-builder, karma-builder, express-builder or back-end-builder
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
  },
  defaultKarmaOptions = {
    //todo: opt.karma=JSON.stringify(karmaOptions)
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage-istanbul-reporter"),
      require("@angular-devkit/build-angular/plugins/karma")
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require("path").join(__dirname, "./coverage/myNgApp"),
      reports: ["html", "lcovonly", "text-summary"],
      fixWebpackSourcePaths: true
    },
    reporters: ["progress", "kjhtml"],
    port: 9876,
    colors: true,
    //logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome"],
    singleRun: false,
    restartOnFileChange: true
  };
*/
