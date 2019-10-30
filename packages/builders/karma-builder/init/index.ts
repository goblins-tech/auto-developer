import * as tools from "@goblins-tech/auto-developer/tools";

export interface InitOptions {
  [key: string]: any;
}

export default function(options: InitOptions): tools.Rule {
  return (tree: tools.Tree, context: tools.SchematicContext) => {
    options = tools.merge(options, {
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
    });

    return tools.chain([
      tools.Template("./files", options.path, {
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
  };
}
