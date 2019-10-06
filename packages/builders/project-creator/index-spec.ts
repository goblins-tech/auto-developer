import init from "./";

//tmp: for test
let options = {
  ts: { compileOnSave: true },
  name: "myproject",
  path: "/myproject2"
};

let test = init(options);
console.log("init:", init);
console.log("test:", test);
