import { init } from "./init/";

export default function(options, cmd = "init"): Rule {
  if (cmd === "init") return init(options);
}
