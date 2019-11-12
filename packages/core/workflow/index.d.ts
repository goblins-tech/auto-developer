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
