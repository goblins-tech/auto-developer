import { Rule, externalSchematic } from "@angular-devkit/schematics";

export interface BuildOptions {}

export default function(options: BuildOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    //for test:
    return externalSchematic("@goblins-tech/project-builder", "init", {
      name: "myProjectBuilder",
      path: "./myProjectBuilderPath"
    });
  };
}
