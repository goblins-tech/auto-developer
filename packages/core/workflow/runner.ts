import { argv } from "process";
import * as tools from "../tools";

const args = require("minimist")(argv.slice(2));

//default actions, use plugin() to add more, or override existing actions,
//you can use namespace style i.e: ["namespace.actionName",{}]
var actions: Actions = {
  install: {
    run(builder, signal, tree, context) {
      if (builder[2].manager == "npm") tools.process.npm(`i ${builder[0]}`);
      return tree;
    }
  },

  exec: {
    run(builder, signal, tree, context) {
      if (typeof builder[0] == "string") {
        if (!builder[0].startsWith("."))
          builder[0] = require(builder[0]).default;
        else builder[0] = require(builder[0]);
      }
      return builder[0](builder[1], builder[2].signal, tree, context);
    }
  }
};

export function run(
  plan: Plan,
  signal = "init",
  tree: tools.Tree,
  context: tools.SchematicContext
): tools.Rule {
  //todo: if action() returns null-> pass the previous tree to the next action()
  var rules = [];
  plan.forEach(action => {
    if (!(action[0] in actions))
      throw new tools.SchematicsException(
        `Error: action ${action[0]} is not supported, use runner.plugin() to register it`
      );
    ["pre", "run", "post"].forEach(hook => {
      if (hook in actions[action[0]])
        rules.push(actions[action[0]][hook](action[1], signal, tree, context));
    });
  });

  return tools.mergeTemplate(rules);
}

//register new actions
export function plugin(action: string, factory: ActionFactory, mode = "merge") {
  if (action in actions && mode == "merge")
    action = tools.objects.merge(action, actions[actions], true);
  actions[action] = factory;
}
