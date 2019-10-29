import * as tools from "@goblins-tech/auto-developer/tools";

export interface InitOptions {
  [key: string]: any;
}

export default function(options: InitOptions): tools.Rule {
  return (tree: tools.Tree, context: tools.SchematicContext) => {
    let defaultOptions = {};
    options = tools.merge(options, defaultOptions); //check angular-builder for karma options

    //todo: inject to package.json
    let dependencies = {
      karma: "",
      "karma-chrome-launcher": "",
      "karma-coverage-istanbul-reporter": "",
      "karma-jasmine": "",
      "karma-jasmine-html-reporter": ""
    };

    return tools.Template("./files", options.path, {
      options,
      ...tools.objects.strings
    });
  };
}
