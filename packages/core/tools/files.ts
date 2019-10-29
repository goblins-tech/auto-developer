import * as schematics from "./schematics";
import { objectType, merge } from "./objects";
import stripJsonComments from "strip-json-comments";

export type JsonData = { [key: string]: any }; //todo: | (kay: string) => any
export const enum MergeOptions {
  "replace", //replace the existing file
  "ignore", //don't replace, but don't throw an exception (useful for JSON data, used for every single key separately)
  "exit", //throw an exception
  "append", //append the new data to the existing content
  "prepend"
}

export const files = {
  read(file: string, tree: schematics.Tree, enc: string = "utf-8"): string {
    if (!tree) throw new SchematicsException("tree is required");
    if (!tree.exists(file))
      throw new schematics.SchematicsException(`${file} is not existing`);
    try {
      return tree.read(path)!.toString(enc);
    } catch (e) {
      throw new Error(`Cannot read ${file}: ${e.message}`);
    }
  },

  write(
    file: string,
    data: any,
    mergeOptions: MergeOptions = "exit"
  ): schematics.Rule {
    return (
      tree: schematics.Tree,
      context: schematics.SchematicContext
    ): schematics.Tree => {
      if (!tree.exists(file)) tree.create(file, data);
      else {
        if (mergeOptions == "exit")
          throw new schematics.SchematicsException(`${file} already exists`);
        tree.overwrite(file, this.str(merge(data, existingData, false)));
      }
      return tree;
    };
  }
};

export const json = {
  str(data: JsonData) {
    //todo: if(objectType(data)==function)data=data(..)
    return JSON.stringify(data, null, 2); //the third parameter is `space`,
  },

  write(
    file: string,
    data: JsonData,
    mergeOptions: MergeOptions,
    keyMergeOptions: MergeOptions = "replace" //used for every single key separately
  ): schematics.Rule {
    return (
      tree: schematics.Tree,
      context: schematics.SchematicContext
    ): schematics.Tree => {
      if (!tree.exists(file)) tree.create(file, this.str(data));
      else {
        let existingData = this.read(file);
        if (keyMergeOptions == "replace")
          data = merge(data, existingData, false);
        else if (keyMergeOptions == "ignore")
          data = merge(existingData, data, false);
        else {
          for (let k in data) {
            if (k in existingData)
              throw new schematics.SchematicsException(
                `${k} already exists in ${file}`
              );
          }
        }

        tree.overwrite(file, this.str(merge(data, existingData, false)));
      }
      return tree;
    };
  },

  read(file: string, tree: schematics.Tree, enc: string = "utf-8"): JsonData {
    try {
      return JSON.parse(stripJsonComments(files.read(file, tree)));
    } catch (e) {
      console.error(e.message);
    }
  }
};

export const enum DependenciesType {
  "",
  "dev",
  "peer"
} //todo: all dependencies types
export function dependencies(
  data: JsonData,
  type: DependenciesType = "",
  mergeOptions: MergeOptions = "replace"
): schematics.Rule {
  if (type == "dev") data = { devDependencies: data };
  else if (type == "peer") data = { peerDependencies: data };
  else data = { dependencies: data };
  return json.write("package.json", data, mergeOptions);
}
