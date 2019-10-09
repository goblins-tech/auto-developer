import { setup } from "./setup/";

export default function(options, cmd = "setup"): Rule {
  if (cmd === "setup") return setup(options);
}
