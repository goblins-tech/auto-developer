import setup from "./";

//tmp: for test
let options = {
  apps: ["ngProject"],
  libs: ["nglib"],
  path: "/myproject"
};

let test = init(options);
console.log("init:", init);
console.log("test:", test);
