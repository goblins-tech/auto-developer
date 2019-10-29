import * as tools from "@goblins-tech/auto-developer/tools";

//todo: regester `app` in angular.json
export interface AppOptions {
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
  architect?: ArchitectOptions;
  path?: string;
}

export interface ArchitectOptions {}

export default function(options: AppOptions): tools.Rule {
  return (tree: tools.Tree, context: tools.SchematicContext) => {
    //todo: inject Apps & libs into init/files/angular.json->projects{}
    options = tools.objects.merge(options, {
      style: "scss",
      routing: true,
      verbose: false,
      spec: false,
      e2e: false,
      root: this.name,
      src: "src",
      dist: "dist", //todo: get this value from :init options
      prefix: tools.objects.strings.dasherize(options.name),
      schematics: "@schematics/angular:component",
      path: "" //todo: get path from Config.path+appName
    });

    //we don't need to totally override architecture, so we merge it separately
    //todo: enable using of variables, ex: outputPath: "$dist/$name"
    options.architect = tools.objects.merge(options.architect, {
      build: {
        builder: "@angular-devkit/build-angular:browser",
        options: {
          outputPath: `${options.dist}/${options.name}`,
          index: `${options.src}/index.html`,
          main: `${options.src}/main.ts`,
          polyfills: `${options.src}/polyfills.ts`,
          tsConfig: "tsconfig.app.json",
          aot: false,
          assets: [`${options.src}/favicon.ico`, `${options.src}/assets`],
          styles: [`${options.src}/styles.${options.style}`],
          scripts: []
        },
        configurations: {
          production: {
            fileReplacements: [
              {
                replace: `${options.src}/environments/environment.ts`,
                with: `${options.src}/environments/environment.prod.ts`
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
          browserTarget: `${options.name}:build`
        },
        configurations: {
          production: {
            browserTarget: `${options.name}:build:production`
          }
        }
      },
      "extract-i18n": {
        builder: "@angular-devkit/build-angular:extract-i18n",
        options: {
          browserTarget: `${options.name}:build`
        }
      },
      test: {
        //todo: show a suggestion to use test-builder/karma or any karma builder
        builder: "@angular-devkit/build-angular:karma",
        options: {
          main: `${options.src}/test.ts`,
          polyfills: `${options.src}/polyfills.ts`,
          tsConfig: "tsconfig.spec.json",
          karmaConfig: "karma.conf.js",
          assets: [`${options.src}/favicon.ico`, `${options.src}/assets`],
          styles: [`${options.src}/styles.scss`],
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
          devServerTarget: `${options.name}:serve`
        },
        configurations: {
          production: {
            devServerTarget: `${options.name}:serve:production`
          }
        }
      }
    });

    //todo: get current installed Angular version
    //todo: adjust version, i.e: modify the baseVersion template based on the required version
    options.baseVersion = options.version;
    var filter = !options.spec ? path => !path.endsWith(".spec.ts") : null;
    return tools.Template(
      `./files/v${options.baseVersion}`, //todo: rename files/**/__name__ to __opt.name__
      `${options.path}/${options.src}`,
      {
        opt: options,
        ...tools.objects.strings,
        name: options.name //todo: temporary: we cannot use objects in file names //https://github.com/angular/angular-cli/issues/15959
      },
      filter,
      true
    );
  };
}
