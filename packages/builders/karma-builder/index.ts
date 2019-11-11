import * as tools from "@goblins-tech/auto-developer/tools";

export default function(
  options,
  signal = "init",
  tree: tools.Tree,
  context: tools.SchematicContext
): tools.Rule {
  if (signal == "init") return init(options, tree, context);
  //todo: other signals
}

export interface InitOptions {
  [key: string]: any;
}

function init(options, tree, context) {
  //check for the project's name and path
  if (!options.name)
    throw new tools.SchematicsException("project's name is required");

  if (!options.path || options.path == "") options.path = `./${options.name}`;
  options.path = tools.objects.normalize(options.path);

  //merge the default values into the provided options
  let defaultInitOptions = {
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      /* todo: don't evaluate require('..') here, just add it as it in karma.config.js
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage-istanbul-reporter"),
    */
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: `${options.path}/coverage/${options.name}`,
      reports: ["html", "lcovonly", "text-summary"],
      fixWebpackSourcePaths: true
    },
    reporters: ["progress", "kjhtml"],
    port: 9876,
    colors: true,
    //logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome"],
    singleRun: false,
    restartOnFileChange: true
  };
  options = tools.object.merge(options, defaultInitOptions, true);

  return tools.chain([
    tools.Template("./templates/init", options.path, {
      options,
      ...tools.objects.strings
    }),
    dependencies({
      karma: "",
      "karma-chrome-launcher": "",
      "karma-coverage-istanbul-reporter": "",
      "karma-jasmine": "",
      "karma-jasmine-html-reporter": ""
    })
  ]);
}
