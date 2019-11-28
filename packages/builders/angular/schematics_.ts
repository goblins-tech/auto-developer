/*
todo:
- move this file to schematics/index.ts -> note that paths from /index.ts
  is relevant to this file i.e url('./files') must be changed to url('../files')
  that's why we temporary put this file in the same dir with ./index.ts

 */
import idx from "./index";
import generate from "./generate";

export function init(options) {
  return (tree, context) => idx(options, "init", tree, context);
}

export function generate(options) {
  let { part, ...options } = options;
  return (tree, context) => generate(part, options, tree, context);
}
