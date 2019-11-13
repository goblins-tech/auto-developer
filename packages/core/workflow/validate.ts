export default function(autoDev: AutoDev) {
  if (autoDev instanceof Array)
    autoDev = {
      config: {},
      builders: autoDev
    };
  if (!autoDev.config.name)
    throw new tools.SchematicsException("project's name is required"); //todo: ask the user for project's name

  //signal can be provided only by CLI, and cannot be included in the autoDev by user
  if ("signal" in autoDev.config) delete autoDev.config.signal;

  autoDev.config = tools.objects.merge(
    autoDev.config,
    {
      root: "./projects",
      path: autoDev.config.name,
      manager: "npm",
      signal //only provided by planner(), cannot provided by autoDev.config
    },
    true
  );

  if (autoDev.config.root.slice(-1) !== "/") autoDev.config.root += "/";
  autoDev.config.path = tools.objects.normalize(
    autoDev.config.root + autoDev.config.path
  );
  if (autoDev.config.path.slice(-1) !== "/") autoDev.config.path += "/";

  return autoDev;
}
