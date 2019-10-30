import * as tools from "@goblins-tech/auto-developer/tools";

export interface InitOptions {
  [key: string]: any;
}
export default function(options: InitOptions): tools.Rule {
  if (!options.name)
    throw new tools.schematics.SchematicsException(
      "project's name is required"
    );

  return (tree: tools.Tree, context: tools.SchematicContext) => {
    options = tools.objects.merge(options, {
      readMe: `
# ${options.name} builder
> a builder for [autoDeveloper](https://github.com/goblins-tech/autoDeveloper) workflow, just add it to autoDeveloper.json file
      `,
      dependencies: {
        "@goblins-tech/auto-developer": ""
      },
      scripts: {
        build: "tsc -w",
        example:
          "schematics .:init --name=myProject --path=/myProject  --dry-run=false --force=true"
      },
      keywords: [options.name + " builder"]
    });

    if (!options.path || options.path == "")
      options.path = `${options.path}/${options.name}`;
    options.path = tools.objects.normalize(options.path);
    if (options.name.substr(-8) !== "-builder") options.name += "-builder";
    if (options.path.substr(-8) !== "-builder") options.path += "-builder";

    return tools.chain([
      tools.externalSchematic("@goblins-tech/project-builder", "init", options),
      tools.Template("./files", options.path, {
        options,
        ...tools.objects.strings
      })
    ]);
  };

  //todo: add @angular-devkit/schematics (and all packages used by this builder) to devDependencies
  //autoDeveloper is responible of installing all packages it uses before working with autoDeveloper.json
  //todo: offer to install prettier (via prettier-builder), tslint (via tslint-builder) or (code-formatter-builder)
}