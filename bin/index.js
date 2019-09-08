#!/usr/bin/env node

//run other bin commands based on the provided arguments ex: > eldeeb --build
// will run bin/build.js
//run >npm link to register the bin commands to make them available every where

const { execSync } = require("child_process");

console.log("======= eldeeb =========");
console.log("> eldeeb --new --project=projectName --front=angular|8.0");
console.log("> eldeeb --build");

const args = process.argv.slice(2);
if (args.includes("--new")) {
  console.log("--new--");
  execSync("node ./new.js");
}
