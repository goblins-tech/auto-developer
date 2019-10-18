//create a new project i.e: create a autoDeveloper.json file

import { validate } from "./validate";
import fs from "fs";

console.log("======= init a project =========");

export default function() {
  const defaultAutoDeveloper = require("./defaultAutoDeveloper.json");
  const autoDeveloper = {}; //merge project's autoDeveloper.json with defaultAutoDeveloper; foreach entry, if no builder, set the default builder
  if (!validate(autoDeveloper))
    throw new Error("== invalid autoDeveloper object ==");

  //todo: create autoDeveloper.json file in the root of the current folder
  fs.writeFile(
    autoDeveloper.path + "/autoDeveloper.json",
    autoDeveloper,
    function(err) {
      //todo: path of the new project's root folder, not this project's root
      if (err) return console.log(err);
      console.log("autoDeveloper.json has been created!");
    }
  );
  return autoDeveloper;
}
