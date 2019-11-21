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
      let [factory, options, config] = builder;
      if (typeof factory == "string") {
        if (!factory.startsWith(".")) factory = require(factory).default;
        else factory = require(factory);
      }
      let builderContext = context; //todo: builderContext is not the same as core context
      return factory(options, config.signal, tree, builderContext); //tools.externalSchematic();
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

  plan.forEach(action => {
    if (!(action[0] in actions))
      throw new tools.SchematicsException(
        `Error: action ${action[0]} is not supported, use runner.plugin() to register it`
      );
    ["pre", "run", "post"].forEach(hook => {
      if (hook in actions[action[0]])
        tree = actions[action[0]][hook](action[1], signal, tree, context);
    });
  });
  return tree;
  return tools.mergeTemplate(tree);
}

//register new actions
export function plugin(action: string, factory: ActionFactory, mode = "merge") {
  if (action in actions && mode == "merge")
    action = tools.objects.merge(action, actions[actions], true);
  actions[action] = factory;
}
