const creator = {
  project: {
    name: "my-project",
    builder: "@eldeeb/project-creator"
    //add other project's info & author's info
  },
  tsconfig: {
    builder: ""
    //override any default option
    //by default it uses @eldeeb/project-creator
  },
  gitignore: [], //gitignore:{builder:'', ignore:[]}
  front: ["angular@8.0", { builder: "@xxyyzz2050/creator-angular" }], //angular@latest
  back: ["express"],
  api: ["graphQl", {}], //or restful
  database: ["mongoDB", {}], //the default db, you can add another databases in add[] section
  ui: ["material", {}], //will be converted to @angular/material, or use add:['@angular/material',{}]

  //add sections, modules, components, install packages, ...
  //to generate a component add:[['component',{name:'myComponent',..}]]
  add: [["articles", {}]] //package name on npm, or short name (for predefined packages)
};

export default creator;
