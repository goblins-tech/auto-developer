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
  //merge the default values into the provided options
  let defaultInitOptions = {};
  options = tools.objects.merge(options, defaultInitOptions, true);

  return tools.Template(
    "./templates/init",
    { options, ...tools.objects.strings },
    null, //filter function (path:string)=>boolian
    true //merge
  );

  /*
  to merge multiple rules:
    rules=[tools.Template(..), tools.dependencies(..), tools.json.write(..)]
    return tools.mergeTemplate(rules);
   */
}
