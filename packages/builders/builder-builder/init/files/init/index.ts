import * as tools from "@goblins-tech/auto-developer/tools";

export interface InitOptions {
  [key: string]: any;
}

export default function(options: InitOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    let defaultOptions = {};
    options = tools.merge(options, defaultOptions);

    return tools.Template("./files", options.path, {
      options,
      ...tools.objects.strings
    });
  };
}
