const wf = require("./workflow");
const tools = require("./tools");

//console.log({ wf });
const autoDev = {
  config: {
    name: "example"
  },
  builders: [
    (options, signal, tree, context) => {
      tree.create("aaa.txt", "ok");
    }
  ]
};
var plan = wf.planner(autoDev);
var tree = wf.runner.run(plan);

console.log({ plan, tree });
