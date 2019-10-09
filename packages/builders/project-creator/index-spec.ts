import init from "./";

//tmp: for test
let options = {
  ts: { compileOnSave: true },
  name: "myproject",
  path: "/myproject"
};

let test = init(options);
console.log("init:", init);
console.log("test:",typeof test, test);
