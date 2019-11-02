import { Rule, externalSchematic } from "@angular-devkit/schematics";

export interface InitOptions {}

export default function(options: InitOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return tree;
  };
}
