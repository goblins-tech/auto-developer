#!/usr/bin/env node

/*
> dv [signal] [options]
signal:
- new (default): create a new auto-developer.js file
- update: update all builder's codes
- test: run a unit test
- e2e: run an e2e test
- builder: create a new builder
- hook: create a hook

*/

//run `npm link` to register the bin commands to make them available every where

const { execSync } = require("child_process");

console.log("======= auto-developer (dv) =========");
console.log("> dv --new --project=projectName --front=angular|8.0");
console.log("> dv --build");

const args = process.argv.slice(2);
if (args.includes("--new")) {
  console.log("--new--");
}
