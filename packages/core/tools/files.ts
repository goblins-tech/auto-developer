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
  "merge" //for json,xml files i.e: add the new data to the existing objects, use keyMergeOptions for every key separately,
  //for keyMergeOptions,same as replace, but for arrays and objects: merge elements instead of replacing the array itself
}

export function read(
  file: string,
  tree: schematics.Tree,
  enc: string = "utf-8"
): string {
  if (!tree) throw new schematics.SchematicsException("tree is required");
  if (!tree.exists(file)) return null;
  //throw new schematics.SchematicsException(`${file} is not existing`);
  try {
    let content = tree.read(file)!.toString(enc);
    return file.endsWith(".json") ? json.parse(content) : content;
  } catch (e) {
    throw new Error(`error: Cannot read file ${file}: ${e.message}`);
  }
}

export function write(
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

export const json = {
  str(data: JsonData) {
    //todo: if(objectType(data)==function)data=data(..)
    return JSON.stringify(data, null, 2); //the third parameter is `space`,
  },
  parse(data) {
    return JSON.parse(stripJsonComments(data));
  },
  read(file: string, tree: schematics.Tree, enc: string = "utf-8"): JsonData {
    try {
      let content = files.read(file, tree);
      return !file.endsWith(".json") ? this.parse(content) : content;
    } catch (e) {
      console.error(e.message);
    }
  },
  write(
    file: string,
    data: JsonData,
    keyMergeOptions: MergeOptions = "merge", //re
    mergeOptions: MergeOptions = "merge"
  ): schematics.Rule {
    return (
      tree: schematics.Tree,
      context: schematics.SchematicContext
    ): schematics.Tree => {
      //if !replace, we don't need to check if the file existing, and we don't need to read it
      //todo: if((exit | ignore) && exists(file)) return;
      if (mergeOptions != "replace") {
        let existingData = this.read(file, tree) || {};

        //if existingData not empty, we have to merge the new data with existing data based on keyMergeOptions value
        if (existingData != {}) {
          //replace: merge data into existingData
          if (keyMergeOptions == "replace")
            data = merge(data, existingData, false);
          //merge existingData into data
          else if (keyMergeOptions == "ignore")
            data = merge(existingData, data, false);
          else {
            //we need to parse data key by key,
            //if there is any duplicate key: keyMergeOptions==exit -> throw error;
            // keyMergeOptions==merge -> merge(for arrays and objects) or replace values
            for (let k in data) {
              if (k in existingData) {
                if (keyMergeOptions == "exit")
                  throw new schematics.SchematicsException(
                    `${k} already exists in ${file}`
                  );
                else if (keyMergeOptions == "merge") {
                  let keyType = objectType(data[k]);

                  //for array and objects: merge (i.e: add elements to existingData[k])
                  //if existingData[k] is not the same type as data[k], convert it
                  if (keyType == "array") {
                    if (objectType(existingData[k]) == "array")
                      data[k] = [...existingData[k], ...data[k]];
                    else data[k] = [existingData[k], ...data[k]];
                  } //or existingData[k].concat(data[k])
                  else if (keyType == "object")
                    data[k] = merge(data[k], existingData[k], false);
                  else data[k] = existingData[k];
                }
                //remove duplicate keys from existingData, later we will add the rest of keys to data
                delete existingData[k];
              }
            }
            //just add none-duplicate keys from existingData into data
            data = merge(data, existingData, false);
          }
        }
      }

      return files.write(file, this.str(data), "replace");
    };
  }
};

//update package.json
export function pkg(
  path: string,
  data: JsonData,
  mergeOptions: MergeOptions = "merge",
  keyMergeOptions: MergeOptions = "merge"
) {
  if (!path.endsWith("package.json")) path += "/package.json";
  return json.write(path, data, mergeOptions, keyMergeOptions);
}

export const enum DependenciesType {
  "",
  "dev",
  "peer"
} //todo: all dependencies types

//add dependencies
export function dependencies(
  path: string,
  data: JsonData,
  type: DependenciesType = "",
  mergeOptions: MergeOptions = "merge",
  keyMergeOptions: MergeOptions = "merge"
): schematics.Rule {
  if (type == "dev") data = { devDependencies: data };
  else if (type == "peer") data = { peerDependencies: data };
  else data = { dependencies: data };
  return pkg(path, data, mergeOptions, keyMergeOptions);
}
