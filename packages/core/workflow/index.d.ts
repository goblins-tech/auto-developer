import * as tools from "../tools";

/*
autoDev={
config: AutoDevConfig,
builders: [Builder],
pre: [string | function], //executes on the physical files before running the builders
post: [string | function],
}


function(factory: BuilderObject){
  factory = BuilderFactory (string | function ) or Builder ([BuilderFunction, options{}, config{}])
}
 */

/*
todo:
- remove ([key: string]: any;) from all interfaces, unless it is allowed
 */

interface AutoDevConfig {
  name: string; //project's name
  path?: string; //project's path = $root/$path or $root/$name
  root?: string; //project's root
  manager?: string; //npm | yarn
  store?: string; //builders' store root

  [key: string]: any;
}

interface BuilderOptions {
  [key: string]: any;
}
type BuilderFactoryFunction = (
  options: BuilderOptions,
  signal: string,
  tree: tools.Tree,
  context: tools.SchematicContext
) => tools.Rule;

type BuilderFactory =
  | string //package name OR path to factory file or dir (index.js) or npm package (pkg.main) OR builder's name inside builders' store
  | BuilderFactoryFunction;

//this type is provided by user, and then to be converted into BuilderObject by ./adaptor
type Builder = [BuilderFactory, BuilderOptions, AutoDevConfig, builderInfo];

interface builderObject {
  factory: BuilderFactory;
  options: BuilderOptions;
  config: AutoDevConfig;
  type: string; //package |...
  path: string; //full path to the factory file
  function: string; //function name | default
  [key: string]: any;
}

interface AutoDevObject {
  builders: Builder[];
  config?: AutoDevConfig;
  pre?: [string | (() => vois)];
  post?: [string | (() => vois)];
}

type AutoDev = AutoDevObject | Builder[]; //if(autoDev:Builder[]) convert to AutoDevObject{}

interface ActionFactory {
  run: (
    builder: Builder,
    tree: tools.Tree,
    signal = "init",
    context: tools.SchematicContext
  ) => tools.Rule;
  pre: (
    builder: Builder,
    tree: tools.Tree,
    signal = "init",
    context: tools.SchematicContext
  ) => tools.Rule;
  post: (
    builder: Builder,
    tree: tools.Tree,
    signal = "init",
    context: tools.SchematicContext
  ) => tools.Rule;
}

interface Actions {
  [key: string]: ActionFactory; //ex: {exec: {run(), pre(), post()} }
}

type Plan = [string, Builder]; //["actionName", builder]
