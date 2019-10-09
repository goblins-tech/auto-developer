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

export interface setupOptions {
  path: string = "/";
  apps?: [string | [string, appOptions]]; //main app = apps[0]
  libs?: [string | [string, appOptions]];
  version: string | number = "latest";
  spec: boolean = false; //add spec files when generating components,...
  generate: generateOptions;
  universal: universalOptions; //via express-creator:setup
  material: materialOptions; //via material-creator:setup {front-end=Angular}
}

export interface appOptions {
  style: "css" | "scss" = "scss";
  routing: boolean = true;
  verbose: boolean = false;
}

export interface appOptions {}
export interface generateOptions {
  [key: string]: any; //for other schematics whitch generate other stuff
  modules: [string | [string, {}]];
  components: [string | [string, {}]]; //if(!module)use modules[0]; if(!exists(module))generate it
  services: [string | [string, {}]];
}
export interface materialOptions {
  theme: "purble" | materialThemeCustom = "purble";
  animations: boolean = true;
  //also install hammerjs, moment
}
export interface materialThemeCustom {}

export function setup(options: initOptions): Rule {
  //todo: check if the files already exists and offer options to:
  //override, ignore, mergeTo, mergeFrom

  return (tree: Tree, context: SchematicContext) => {
    if (!options.path) options.path = "/"; //just for typescript
    options.path = normalize(options.path);

    let defaultSetupOptions = {
      version: "8",
      readMe: "" //add readMe to #Angular-creator section
    };

    options = mergeOptions(options, defaultPkg, true);
    return template(
      `../../init/files/v${options.version}`,
      options,
      null,
      options.path,
      true
    );
  };
}
