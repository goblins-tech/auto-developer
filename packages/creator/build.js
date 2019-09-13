//loads creator.json and validate it, then merge it with defaulrCreator{} and cli arguments

const creator = require("./new.js");

const projectCreator = creator.project; //default=@eldeeb/project-creator
//`npm install -D projectCreator.builder`
//projectCreator( projectCreator, creator); returns Schematics Rule
