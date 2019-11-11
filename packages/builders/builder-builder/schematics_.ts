import idx from "./index";

export function init(options) {
  return (tree, context) => idx(options, "init", tree, context);
}
