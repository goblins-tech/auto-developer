#!/usr/bin/env node

//todo: usr bin/new.js to create and validate config.js then load it and merge it with
//defaultConfig.json and cli arguments,
//note that the project may use multiple values for one entries, for example
//it can use more than one database type, mongoDB and mysql
const config = {
  front: ["angular", { version: 8, projectName: "myProject" }],
  back: ["express", { version: 0 }],
  api: ["graphQl", {}],
  database: ["mongoDB", {}],
  ui: ["material", {}], //will be converted to @angular/material, or use add:['@angular/material',{}]

  //add sections, modules, components, install packages, ...
  //to generate a component add:[['component',{name:'myComponent',..}]]
  add: [["articles", {}]] //package name on npm, or short name (for predefined packages)
};

//build the project
