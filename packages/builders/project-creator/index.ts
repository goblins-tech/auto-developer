import { Rule, SchematicContext, Tree } from "@angular-devkit/schematics";

//returns a Schematics Rule to initiate the workspace
export default function(creator: any /*creator:Creator*/, options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return tree;
  };
}
