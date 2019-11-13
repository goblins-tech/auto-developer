import * as wf from "../workflow";
import * as tools from "../tools";

export default function(options): tools.Rule {
  return (tree: tools.Tree, context: tools.SchematicContext) => {
    var autoDev; //todo: load autoDev file (--dv=./autoDev.js), default=./auto-developer.js

    //tmp: just for testing
    autoDev = {
      config: {
        name: "example"
      },
      builders: ["@goblins-tech/nodejs-builder"]
    };
    /*
    for new projects run init(autoDev) first to return the final autoDev,
      it runs validate() internally
      for existing projects just run validate
     */
    if (options.signal == "init") autoDev = wf.init(autoDev);
    else autoDev = wf.validate(autoDev);

    let plan = wf.planner(autoDev);
    wf.runner.run(plan);
    return tree;
  };
}
