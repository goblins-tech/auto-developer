import {
  Rule,
  Tree,
  SchematicContext,
  SchematicsException,
  chain
} from "@angular-devkit/schematics";

import { strings, normalize } from "@angular-devkit/core";
import { mergeOptions, template } from "creator/tools/schematics";

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
  architect?: architectOptions; //todo:
}

export interface architectOptions {}
export interface AppOptions {}

export default function(options: AppOptions): Rule {
  let defaultAppOptions = {
    style: "scss",
    routing: true,
    verbose: false,
    spec: false,
    e2e: false,
    root: this.name,
    src: "src",
    prefix: strings.dasherize(this.name),
    architect: defaultArchitectOptions,
    schematics: "@schematics/angular:component",
    architect: defaultArchitectOptions
  };
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
  };

  //todo: get current installed Angular version
  //todo: adjust version, i.e: modify the baseVersion template based on the required version
  return template(
    `builders/angular-creator/init/files/v${options.baseVersion}`,
    { opt: options },
    null,
    options.path,
    true
  );
}
