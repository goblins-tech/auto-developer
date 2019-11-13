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

    autoDev = wf.init(autoDev, options.signal); //final autoDev

    let plan = wf.planner(autoDev);
    wf.runner.run(plan);
    return tree;
  };
}
