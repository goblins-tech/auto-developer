import { argv } from "process";
import * as tools from "../tools";
import * as Path from "path";

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
      let { factory, options, config, type, path } = builder;

      if (type == "file") factory = require(path + factory).default;
      else if (type == "package") factory = require(path + factory);

      let builderContext = { ...context }; //builderContext is not the same as core context

      //todo: create the context for the builder
      builderContext.schematic.description.path = path; //"../../builders/nodejs-builder"
      //console.log(builderContext.schematic);
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

  var rules = [];
  plan.forEach(action => {
    var [action, builder] = action;
    if (!(action in actions))
      throw new tools.SchematicsException(
        `Error: action ${action} is not supported, use runner.plugin() to register it`
      );
    ["pre", "run", "post"].forEach(hook => {
      if (hook in actions[action])
        rules.push(actions[action][hook](builder, signal, tree, context));
      //tree = actions[action][hook](...); then return tree; did'nt work
    });
  });

  return tools.chain(rules);
}

//register new actions
export function plugin(action: string, factory: ActionFactory, mode = "merge") {
  if (action in actions && mode == "merge")
    action = tools.objects.merge(action, actions[actions], true);
  actions[action] = factory;
}
