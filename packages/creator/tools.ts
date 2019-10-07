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

export function template(
  files: string | Source,
  vars?: any,
  filter: Rule = path => _filter(path => true),
  merge = true
) {
  if (typeof files == "string") files = url(files); //or if(!(files instanceof Source)
  let tmpl = apply(files, [filter, _template(vars)]);
  if (!merge) return tmpl;
  else return mergeTemplate(tmpl);
}

export function mergeTemplate(tmpl) {
  return chain([branchAndMerge(chain([mergeWith(tmpl)]))]);
}
