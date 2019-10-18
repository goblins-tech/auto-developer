import { Rule, externalSchematic } from "@angular-devkit/schematics";

export interface buildOptions {}

export function build(options: buildOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    //for test:
    return externalSchematic("@xxyyzz2050/project-builder", "init", {
      name: "myProjectBuilder",
      path: "/myProjectBuilderPath"
    });
  };
}
