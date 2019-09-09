//loads creator.json and validate it, then merge it with defaulrCreator{} and cli arguments

const creator = require("./creator.json"); //todo: path of the new project's root folder
//todo: merge(require("./creator.json"), defaulrCreator{})
//todo: foreach entry, if no builder, set the default builder
//todo: write the final creator.json

const validate = require("./validate.js");

if (!validate.check(creator)) console.log(" ===  error ===");
else {
  /*
  front=creator.front[1].builder
 install  front (default=angular@latest)
 then call front(creator.front[])
*/
}
