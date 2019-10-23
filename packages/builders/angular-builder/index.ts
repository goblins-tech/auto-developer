import init from "./init/";
import { Rule } from "../tools;

export default function(options, cmd = "init"): Rule {
  if (cmd === "init") return init(options);
}
