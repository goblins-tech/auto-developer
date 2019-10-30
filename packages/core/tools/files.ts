import * as schematics from "./schematics";
import { objectType, merge } from "./objects";
import stripJsonComments from "strip-json-comments";

export type JsonData = { [key: string]: any }; //todo: | (kay: string) => any
export const enum MergeOptions {
  "replace", //replace the existing file
  "ignore", //don't replace, but don't throw an exception
  "exit", //throw an exception
  "append", //append the new data to the existing content
  "prepend",
  "add" //for json,xml files i.e: add the new data to the existing objects, use keyMergeOptions for every key separately,
  //for keyMergeOptions,same as replace, but for arrays and objects: merge elements instead of replacing the array itself
}

export const files = {
  read(file: string, tree: schematics.Tree, enc: string = "utf-8"): string {
    if (!tree) throw new schematics.SchematicsException("tree is required");
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
        if (mergeOptions == "replace") tree.overwrite(file, data);
        //todo: mergeStrategy
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
    keyMergeOptions: MergeOptions = "add", //re
    mergeOptions: MergeOptions = "add"
  ): schematics.Rule {
    return (
      tree: schematics.Tree,
      context: schematics.SchematicContext
    ): schematics.Tree => {
      if (tree.exists(file)) {
        let existingData = this.read(file);
        if (keyMergeOptions == "replace")
          data = merge(data, existingData, false);
        else if (keyMergeOptions == "ignore")
          data = merge(existingData, data, false);
        else {
          for (let k in data) {
            if (k in existingData) {
              if (keyMergeOptions == "exit")
                throw new schematics.SchematicsException(
                  `${k} already exists in ${file}`
                );
              else if (keyMergeOptions == "add") {
                let keyType = objectType(k);
                if (keyType == "array")
                  data[k] = [objectType(existingData[k]=="array")?...existingData[k]:existingData[k], ...data[k]];
                //or existingData[k].concat(data[k])
                else if (keyType == "object")
                  data[k] = merge(data[k], existingData[k], false);
              }
            }
          }
        }
      }
      return files.write(file, this.str(data), "replace");
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
  path: string,
  data: JsonData,
  type: DependenciesType = "",
  mergeOptions: MergeOptions="add",
  keyMergeOptions: MergeOptions = "add"
): schematics.Rule {
  if (!path.endsWith("package.json")) path += "/package.json";
  if (type == "dev") data = { devDependencies: data };
  else if (type == "peer") data = { peerDependencies: data };
  else data = { dependencies: data };
  return json.write(path, data, mergeOptions, keyMergeOptions);
}
