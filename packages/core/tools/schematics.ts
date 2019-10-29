import * as schematics from "@angular-devkit/schematics";
export * from "@angular-devkit/schematics";
import { objectType } from "./objects";

export function Template(
  from: string | schematics.Source,
  to?: string,
  vars?: any,
  filter?: (filePath: string) => boolean, //todo: | Rule   // Rule = path => _filter(path => true), //todo: benchmark filter=null VS filter=path=>_filter(..)
  merge = true
) {
  //console.log({from,to,vars,filter,merge})
  if (typeof from == "string") from = schematics.url(from); //or if(!(files instanceof Source)
  let tmpl = schematics.apply(from, [
    filter ? schematics.filter(filter) : schematics.noop(), //todo: noop() VS null
    schematics.template(vars),
    to ? schematics.move(to) : schematics.noop()
  ]); //todo: allow move empty dirs
  if (!merge) return tmpl;
  else return mergeTemplate(tmpl);
}

export function mergeTemplate(tmpl, strategy: schematics.MergeStrategy) {
  if (tmpl instanceof Array) return schematics.chain(tmpl);
  return schematics.chain([
    schematics.branchAndMerge(
      schematics.chain([schematics.mergeWith(tmpl, strategy)])
    )
  ]);
  //or: mergeWith(templateSource, MergeStrategy.Overwrite);
}
