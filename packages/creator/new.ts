//create a new project i.e: create a creator.json file

const fs = require("fs");

console.log("======= init a project =========");

export default function creator() {
  const defaultCreator = require("./creator.json");
  const creator = {}; //merge project's creator.json with defaultCreator; foreach entry, if no builder, set the default builder
  if (!validate.check(creator)) throw new Error("== invalid creator object ==");

  //todo: create creator.json file in the root of the current folder
  fs.writeFile("./creator.json", creator, function(err) {
    //todo: path of the new project's root folder, not this project's root
    if (err) return console.log(err);
    console.log("creator.json has been created!");
  });
  return creator;
}
