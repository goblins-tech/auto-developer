/*
todo: move files/[apps] to schematics:app, and create schematics: lib,service,component,...
 */

import {
  Rule,
  Tree,
  SchematicContext,
  SchematicsException,
  chain
} from "@angular-devkit/schematics";

import { strings, normalize } from "@angular-devkit/core";
import { mergeOptions, template } from "creator/tools";
import fs from "fs";

//returns a Schematics Rule to initiate the workspace
//'main' schematic function, todo: rename to main()?

export interface setupOptions {
  path: string;
  apps?: [string | [string, appOptions]]; //main app = apps[0], if no apps use project's name
  libs?: [string | [string, libsOptions]];
  version?: string | number;
  spec?: boolean; //add spec files when generating components,...
  e2e?: boolean;
  generate: generateOptions;
  universal: universalOptions; //via express-creator:setup
  material: materialOptions; //via material-creator:setup {front-end=Angular}
  karma: karmaOptions;
  config: {
    apps: appOptions;
    libs: libsOptions;
    modules: modulesOptions;
    components: componentsOptions;
  };
}

export interface appOptions {
  name: string;
  style?: "css" | "scss" | "sass" | "less" | "styl";
  /*private*/ styleExt?: string; //cannot use private for interface members; this value shouldn't be provided by the user
  routing?: boolean | "separate"; //by default: create Routes[] inside the module file (not as a separate file)
  verbose?: boolean;
  spec?: boolean;
  e2e?: boolean;
  schematics?: string;
  root?: string;
  src?: string;
  prefix?: string /*= "app";*/; //todo: use different prefix for each app
  architect?: {}; //todo: architectOptions
}

export interface generateOptions {
  [key: string]: any; //for other schematics whitch generate other stuff
  modules: [string | [string, modulesOptions]];
  components: [string | [string, componentsOptions]]; //if(!module)use modules[0]; if(!exists(module))generate it
  services: [string | [string, servicesOptions]];
}

export interface libsOptions {}
export interface componentsOptions {}
export interface modulesOptions {}
export interface servicesOptions {}

export interface materialOptions {
  theme: "purble" | materialThemeCustom;
  animations: boolean;
  //also install hammerjs, moment
}
export interface materialThemeCustom {}

export interface karmaOptions {
  //todo: import `ts difinitions` from karma
  frameworks?: string;
}

export interface universalOptions {}

export function setup(options: setupOptions): Rule {
  //todo: check if the files already exists and offer options to:
  //override, ignore, mergeTo, mergeFrom

  if (fs.existsSync(`../../init/files/v${options.version}`))
    throw new SchematicsException("this version not supported"); //todo: select from the available versions

  return (tree: Tree, context: SchematicContext) => {
    if (!options.path) options.path = "/"; //just for typescript
    options.path = normalize(options.path);

    let defaultArchitectOptions = {
        build: {
          builder: "@angular-devkit/build-angular:browser",
          options: {
            outputPath: "$dist/$appName",
            index: "$src/index.html",
            main: "$src/main.ts",
            polyfills: "$src/polyfills.ts",
            tsConfig: "tsconfig.app.json",
            aot: false,
            assets: ["$src/favicon.ico", "$src/assets"],
            styles: ["$src/styles.scss"],
            scripts: []
          },
          configurations: {
            production: {
              fileReplacements: [
                {
                  replace: "$src/environments/environment.ts",
                  with: "$src/environments/environment.prod.ts"
                }
              ],
              optimization: true,
              outputHashing: "all",
              sourceMap: false,
              extractCss: true,
              namedChunks: false,
              aot: true,
              extractLicenses: true,
              vendorChunk: false,
              buildOptimizer: true,
              budgets: [
                {
                  type: "initial",
                  maximumWarning: "2mb",
                  maximumError: "5mb"
                },
                {
                  type: "anyComponentStyle",
                  maximumWarning: "6kb",
                  maximumError: "10kb"
                }
              ]
            }
          }
        },
        serve: {
          builder: "@angular-devkit/build-angular:dev-server",
          options: {
            browserTarget: "$appName:build"
          },
          configurations: {
            production: {
              browserTarget: "$appName:build:production"
            }
          }
        },
        "extract-i18n": {
          builder: "@angular-devkit/build-angular:extract-i18n",
          options: {
            browserTarget: "$appName:build"
          }
        },
        test: {
          builder: "@angular-devkit/build-angular:karma",
          options: {
            main: "$src/test.ts",
            polyfills: "$src/polyfills.ts",
            tsConfig: "tsconfig.spec.json",
            karmaConfig: "karma.conf.js",
            assets: ["$src/favicon.ico", "$src/assets"],
            styles: ["$src/styles.scss"],
            scripts: []
          }
        },
        lint: {
          builder: "@angular-devkit/build-angular:tslint",
          options: {
            tsConfig: [
              "tsconfig.app.json",
              "tsconfig.spec.json",
              "e2e/tsconfig.json"
            ],
            exclude: ["**/node_modules/**"]
          }
        },
        e2e: {
          builder: "@angular-devkit/build-angular:protractor",
          options: {
            protractorConfig: "e2e/protractor.conf.js",
            devServerTarget: "$appName:serve"
          },
          configurations: {
            production: {
              devServerTarget: "$appName:serve:production"
            }
          }
        }
      },
      defaultSetupOptions = {
        path: "/",
        apps: ["app"],
        libs: [],
        version: "latest", //8
        spec: false,
        e2e: false,
        style: "scss",
        styleExt: this.style == "scss" ? "scss" : "css", //based on `style`, shouldn't be provided by the user; todo: list all options
        routing: true, //todo: add to config{apps,libs,...}
        verbose: false, //todo: add to config
        src: "src",
        dist: "dist",
        readMe: "", //add readMe to #Angular-creator section
        karma: {},
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
        },
        config: {
          //default options for every part (apps, libs, modules, components, services, ...)
          // it overrides the top-level options (global options), and overrided by every app, lib, ...
          apps: {
            root: "",
            schematics: "@schematics/angular:component",
            architect: defaultArchitectOptions
          },
          modules: {},
          components: {},
          services: {}
        }
      },
      defaultAppOptions = {
        style: "scss",
        styleExt: "scss",
        routing: true,
        verbose: false,
        spec: false,
        e2e: false,
        root: this.name,
        src: "src",
        prefix: strings.dasherize(this.name),
        architect: defaultArchitectOptions
      },
      defaultMaterialOptions = {
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

    let dependencies = {
        //todo: add to package.json
        "@angular/animations": "~8.2.9",
        "@angular/common": "~8.2.9",
        "@angular/compiler": "~8.2.9",
        "@angular/core": "~8.2.9",
        "@angular/forms": "~8.2.9",
        "@angular/platform-browser": "~8.2.9",
        "@angular/platform-browser-dynamic": "~8.2.9",
        "@angular/router": "~8.2.9",
        rxjs: "~6.4.0",
        tslib: "^1.10.0",
        "zone.js": "~0.9.1"
      },
      devDependencies = {
        "@angular-devkit/build-angular": "~0.803.8",
        "@angular/cli": "~8.3.8",
        "@angular/compiler-cli": "~8.2.9",
        "@angular/language-service": "~8.2.9",
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
        "ts-node": "~7.0.0",
        tslint: "~5.15.0",
        typescript: "~3.5.3"
      };

    options = mergeOptions(options, defaultSetupOptions, true);
    let rules = [];
    rules.push(
      template(
        `../../init/files/v${options.version}`,
        { opt: options },
        path => !path.includes("[apps]"),
        options.path,
        true
      )
    );

    //todo: move to: schematics("apps",appOptions)
    for (let n = 0; n < options.apps.length; ni++) {
      rules.push(
        template(
          `../../init/files/v${options.version}/[apps]`,
          { opt: options, n },
          null,
          options.path + "/" + options.src,
          true
        )
      );
    }

    return chain[rules];
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
