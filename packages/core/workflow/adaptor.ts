import * as tools from "../tools";
import * as fs from "fs";
import * as Path from "path";

export default function(autoDev: AutoDev, signal): AutoDev {
  if (autoDev instanceof Array)
    autoDev = {
      config: {},
      builders: autoDev,
      pre: [],
      post: []
    };
  if (!autoDev.config.name)
    throw new tools.SchematicsException("project's name is required"); //todo: ask the user for project's name

  //signal can be provided only by CLI, and cannot be included in the autoDev by user
  if ("signal" in autoDev.config) delete autoDev.config.signal;

  autoDev.config.originalPath = autoDev.config.path || "";
  autoDev.config = tools.objects.merge(
    autoDev.config,
    {
      root: "./projects",
      path: autoDev.config.name,
      manager: "npm",
      store: "./builders",
      signal //only provided by planner(), cannot provided by autoDev.config
    },
    true
  );

  if (autoDev.config.root.slice(-1) !== "/") autoDev.config.root += "/";
  autoDev.config.path = tools.objects.normalize(
    autoDev.config.root + autoDev.config.path
  );
  if (autoDev.config.path.slice(-1) !== "/") autoDev.config.path += "/";

  //adjust builders:
  autoDev = adjustBuilders(autoDev);

  return autoDev;
}

function adjustBuilders(autoDev: AutoDev): AutoDev[] {
  autoDev.builders.forEach((builder, idx) => {
    if (!(builder instanceof Array)) builder = [builder, {}, {}];

    //merge options (add name,path), config(override some configs just for this builder)
    if (builder[2] && "signal" in builder[2]) delete builder[2].signal;

    builder = {
      factory: builder[0],
      options: tools.objects.merge(
        builder[1],
        {
          name: autoDev.config.name,
          path: autoDev.config.path
        },
        false
      ),
      config: tools.objects.merge(builder[2] || {}, autoDev.config, true)
    };

    /*
    add info: type, path, factory, ..

    - packageName[@version] | @scope/packageName[@version] => package
    - userName/builderName[#functionName] |  ~builderName[#functionName] => store
    - => store: @goblins-tech/builderName
    - function() => function
    - ./path[#functionName] (to file | dir | package) => file


    todo:
    - check builder.paths
    - functionName
    - ~builderName -> @goblins-tech/builderName
     */
    if (typeof builder.factory == "string") {
      var firstChar = builder.factory.substring(0, 1);

      if (firstChar == "@" || firstChar == "~") {
        builder.factory = builder.factory.substring(1);
        [builder.factory, builder.version] = builder.factory.split("@");
        builder.type = "package";
        builder.path = `../../node_modules/${builder.factory}/`;
      } else if (firstChar == ".") {
        builder.type = "file";
        [builder.path, builder.factory] = getFactory(builder.factory);
      } else {
        let store = autoDev.config.store;
        if (store.slice(-1) !== "/") store += "/";
        builder.type = "file";
        firstChar == "@";
        if (builder.factory.indexOf("/") == -1)
          builder.factory = `${autoDev.config.admin}/${builder.factory}`;
        [builder.path, builder.factory] = getFactory(store + builder.factory);
      }
    } else {
      builder.type = "function";
      builder.path = "./";
    }

    builder.path = Path.resolve(builder.path); //convert relative path to absolute path
    if (builder.path.slice(-1) !== "/") builder.path += "/";

    autoDev.builders[idx] = builder;
  });
  return autoDev;
}

function getFactory(path: string): string {
  if (!fs.existsSync(path))
    throw new tools.SchematicsException(`Error: path not found ${path}`);

  if (fs.lstatSync(path).isDirectory()) {
    if (path.slice(-1) !== "/") path += "/";
    var file;
    if (fs.existsSync(path + "package.json")) {
      let pkg = JSON.parse(fs.readFileSync(path + "package.json") || {}); //require(.. .json)
      file = pkg.main;
    }
    return [path, file || "index.js"]; //todo: relative to autoDev.js
  } else {
    return [Path.dirname(path), Path.basename(path)];
  }
}
