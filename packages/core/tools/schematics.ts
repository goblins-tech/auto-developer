import * as schematics from "@angular-devkit/schematics";
export * from "@angular-devkit/schematics"; //todo: only rename template,filter
import { objectType } from "./objects";

/*Rule,
  Tree,
  SchematicContext,
  SchematicsException
  apply,
  template as _template,
  url,
  move,
  chain,
  branchAndMerge,
  mergeWith,
  filter ,
  MergeStrategy,
*/

export function template(
  from: string | schematics.Source,
  to?: string,
  vars?: any,
  filter?: (filePath: string) => boolean, //todo: | Rule   // Rule = path => _filter(path => true), //todo: benchmark filter=null VS filter=path=>_filter(..)
  merge = true
) {
  //console.log({from,to,vars,filter,merge})
  if (typeof from == "string") from = schematics.url(from); //or if(!(files instanceof Source)
  let tmpl = schematics.apply(from, [
    filter ? schematics.filter(filter) : null,
    schematics.template(vars),
    to ? schematics.move(to) : null
  ]);
  if (!merge) return tmpl;
  else return mergeTemplate(tmpl);
}

export function mergeTemplate(tmpl) {
  if (tmpl instanceof Array) tmpl = schematics.chain(tmpl);
  return schematics.chain([
    schematics.branchAndMerge(schematics.chain([schematics.mergeWith(tmpl)]))
  ]);
  //or: mergeWith(templateSource, MergeStrategy.Overwrite);
}
