interface AutoDevConfig {
  name: string;
  path?: string;
  root?: string;
  manager?: string; //npm | yarn
  [key: string]: any;
}

interface BuilderOptions {
  [key: string]: any;
}

type Builder = [string, BuilderOptions, AutoDevConfig];

interface AutoDevObject {
  config: AutoDevConfig;
  builders: Builder[];
}

type AutoDev = AutoDevObject | Builder[];

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
  [key: string]: ActionFactory;
}

type Plan = [string, Builder]; //["actionName", builder]
