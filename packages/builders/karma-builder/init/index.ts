import * as tools from "@goblins-tech/auto-developer/tools";

export interface InitOptions {
  [key: string]: any;
}

export default function(options: InitOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
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

    return tools.template("./files", options.path, {
      options,
      ...tools.strings
    });
  };
}
