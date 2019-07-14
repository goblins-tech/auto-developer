import { Rule, SchematicContext, Tree } from "@angular-devkit/schematics";

export function install(options: any): Rule {
  console.log("======= example =========");
  return (tree: Tree, context: SchematicContext) => {
    return tree;
  };
}
