import {
  Rule,
  SchematicContext,
  Tree
  /*apply,
  MergeStrategy,
  mergeWith,
  move,
  template,
  url*/
} from "@angular-devkit/schematics";
//returns a Schematics Rule to initiate the workspace
export function projectCreator( //'main' schematic function, todo: rename to main()?
  creator: any /*creator:Creator*/,
  options: any
): Rule {
  return (tree: Tree, context: SchematicContext) => {
    /*  const movePath = "/"; //normalize(_options.path + "/");
    const templateSource = apply(url("./files"), [
      template({ ...options }),
      move(movePath)
    ]);
    const rule = mergeWith(templateSource, MergeStrategy.Overwrite);*/
    tree.create("hello.ts", 'console.log("Hello, World")');
    return tree;
  };
}
