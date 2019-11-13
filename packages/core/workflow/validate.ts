export default function(autoDev: AutoDev) {
  if (autoDev instanceof Array)
    autoDev = {
      config: {},
      builders: autoDev
    };
  if (!autoDev.config.name)
    throw new tools.SchematicsException("project's name is required"); //todo: ask the user for project's name

  if ("signal" in autoDev.config) delete autoDev.config.signal;
  return autoDev;
}
