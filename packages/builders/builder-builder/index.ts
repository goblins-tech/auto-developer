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
  if (!options.name)
    throw new tools.SchematicsException("builder's name is required");

  //options.path is added by autoDev.config
  if (!options.path || options.path == "") options.path = `./${options.name}`;
  options.path = tools.objects.normalize(options.path);

  if (options.name.substr(-8) !== "-builder") options.name += "-builder";
  if (options.path.substr(-8) !== "-builder") options.path += "-builder";

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
        start: "schematics .:init --dry-run=false --force=true"
      },
      keywords: [options.name]
    },
    true
  );

  return tools.mergeTemplate([
    tools.externalSchematic("@goblins-tech/nodejs-builder", "init", options),
    tools.Template(
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
