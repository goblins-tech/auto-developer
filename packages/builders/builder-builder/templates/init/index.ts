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

export interface InitOptions {
  [key: string]: any;
}

function init(options, tree, context) {
  //check for the project's name and path
  if (!options.name)
    throw new tools.SchematicsException("project's name is required");

  if (!options.path || options.path == "") options.path = `./${options.name}`;
  options.path = tools.objects.normalize(options.path);

  //merge the default values into the provided options
  let defaultInitOptions = {};
  options = tools.object.merge(options, defaultInitOptions, true);

  return tools.Template(
    "./templates/init",
    { options, ...tools.objects.strings },
    null, //filter function (path:string)=>boolian
    true //merge
  );

  /*
  to merge multiple rules:
    rules=[tools.Template(..), tools.dependencies(..), tools.files.json.write(..)]
    return tools.mergeTemplate(rules);
   */
}
