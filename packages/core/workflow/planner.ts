/*
todo:
- the workflow plan will be different for every signal (i.e: init, update, test, e2e, ...)
- >dv $signal $name* $path --options
 */
import * as rn from "./runner";
import * as fs from "fs";

export default function(autoDev: AutoDev, signal = "init") {
  var plan = []; //todo: plan = [rn.install() or ()=>rn.install()] ??
  if (autoDev instanceof Array)
    autoDev = {
      config: {},
      builders: autoDev
    };
  if (!autoDev.config.name)
    throw new tools.SchematicsException("project's name is required"); //todo: ask the user for project's name

  if ("signal" in autoDev.config) delete autoDev.config.signal;
  autoDev.config = tools.objects.merge(
    autoDev.config,
    {
      root: "./projects",
      path: autoDev.config.name,
      manager: "npm",
      signal //only provided by planner(), cannot provided by autoDev.config
    },
    true
  );

  if (options.root.slice(-1) !== "/") options.root += "/";
  autoDev.config.path = tools.objects.normalize(
    autoDev.config.root + autoDev.config.path
  );
  if (options.path.slice(-1) !== "/") options.path += "/";

  autoDev.builders.forEach(builder => {
    if (typeof builder == "string") builder = [builder, {}, {}];

    //merge options (add name,path), config(override some configs just for this builder)
    if ("signal" in builder[2]) delete builder[2].signal;
    let config = tools.merge(builder[2], autoDev.config, true);
    builder = [
      builder[0],
      tools.merge(
        builder[1],
        {
          name: config.name,
          path: config.path
        },
        false
      ),
      config
    ];

    if (typeof builder == "string") {
      if (!builder.startsWith(".")) plan.push(rn.install(builder));
      //todo: install options
      else if (lstatSync(builder[0]).isDirectory()) {
        builder[0] = null; //todo: path to package.json/main or index.js
      }
    }

    plan.push(rn.exec(builder /*todo: ,tree,contex*/));
  });

  return plan; //todo: every result from exec() [i.e: Tree| Rule] must be passed to the next exec()
}
