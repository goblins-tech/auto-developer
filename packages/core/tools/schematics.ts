import {
  Rule,
  Tree,
  SchematicContext,
  SchematicsException,
  apply,
  template as _template,
  url,
  move,
  chain,
  branchAndMerge,
  mergeWith,
  filter as _filter,
  Source

  /*
  MergeStrategy,
  ,
  ,
*/
} from "@angular-devkit/schematics";

import { objectType } from "./objects";

export function template(
  files: string | Source,
  vars?: any,
  filter:path=>boolean //todo: | Rule   // Rule = path => _filter(path => true), //todo: benchmark filter=null VS filter=path=>_filter(..)
  path?: string,
  merge = true
) {
  if (typeof files == "string") files = url(files); //or if(!(files instanceof Source)
  let tmpl = apply(files, [
    filter ? _filter(filter) : null,
    _template(vars),
    path ? move(path) : null
  ]);
  if (!merge) return tmpl;
  else return mergeTemplate(tmpl);
}

export function mergeTemplate(tmpl) {
  return chain([branchAndMerge(chain([mergeWith(tmpl)]))]);
  //or: mergeWith(templateSource, MergeStrategy.Overwrite);
}

//merge options with defaultOptions, remove null values (ex: {x:null} -> remove x from defaultOptions)
export function mergeOptions(
  options,
  defaultOptions: {} | boolean,
  removeNull = true
) {
  if (objectType(defaultOptions) == "object") {
    //note that: also ([] instanceof Object)==true
    options = Object.assign(defaultOptions, options);
  } else removeNull = defaultOptions;

  if (removeNull !== false) {
    for (let k in options) {
      if (options.hasOwnProperty(k) && options[k] === null) delete options[k];
    }
    return options;
  }
}
