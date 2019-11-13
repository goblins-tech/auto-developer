import * as wf from "../workflow";
import * as tools from "../tools";

export default function(options): tools.Rule {
  return (tree: tools.Tree, context: tools.SchematicContext) => {
    //for new projects run init(autoDev) first
    var autoDev;

    //returns the final autoDev
    if (options.signal == "init") autoDev = wf.init(autoDev);
    else autoDev = wf.validate(autoDev);

    let plan = wf.planner(autoDev);
    wf.runner.run(plan);
    return tree;
  };
}
