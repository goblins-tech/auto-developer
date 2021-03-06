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

export interface InitOptions {}

function init(options, tree, context) {
  if (options.name.slice(-8) !== "-builder") options.name += "-builder";
  if (options.path.slice(-8) !== "-builder") options.path += "-builder";

  options = tools.objects.merge(
    options,
    {
      readMe: `
# ${options.name}
> a builder for [auto-developer](https://github.com/goblins-tech/auto-developer) workflow, just add it to auto-developer.js file
      `,
      schematics: "./schematics.json",
      dependencies: {
        "@goblins-tech/auto-developer": ""
      },
      scripts: {
        build: "tsc -w",
        start: "schematics .:init --dry-run=false --force=true",
        build: "tsc -p tsconfig.json",
        "build:watch": "npm run build --watch",
        "npm:publish":
          "npm run build && npm version patch && npm publish --access=public",
        "npm:pack": "npm run build && npm pack"
      },
      keywords: [options.name]
    },
    true
  );

  return tools.mergeTemplate([
    tools.externalSchematic("@goblins-tech/nodejs-builder", "init", options),
    tools.templates(
      "./templates/init",
      options.path,
      { opt: options, ...tools.objects.strings },
      null,
      true
    )
  ]);
  /*
  todo:
  - add @angular-devkit/schematics (and all packages used by this builder) to devDependencies
    auto-developer is responible of installing all packages it uses before working with auto-developer.json
  - offer to install prettier (via prettier-builder), tslint (via tslint-builder) or (code-formatter-builder)
   */
}
