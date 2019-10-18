import { setup } from "./setup/";
import { Rule } from "@angular-devkit/schematics";

export default function(options, cmd = "setup"): Rule {
  if (cmd === "setup") return setup(options);
}
