#!/usr/bin/env node

//create a new project i.e: create creator.json file, then use bin/build.js
// to convert creator.json to a project

//to adjust creator.json you can use cli arguments (i.e: --project=projectName)
//or GUI (i.e via browser) or manually create a json file

const fs = require("fs");

console.log("======= init a project =========");

const creator = {
  project: "my-project",
  front: ["angular", 8], //['angular',{version:8, builder:@eldeeb/creator-angular, ...otherOptions}],
  back: "express", //['express',{version:'latest'}],
  database: "mongodb", //the default db, you can add another databases in add[] section
  api: "restful", //or graphQl
  add: [] //add sections, packages, components, ...
};

fs.writeFile("creator.json", creator, function(err) {
  if (err) return console.log(err);
  console.log("The file was saved!");
});

//todo: create creator.json file in the root of the current folder
