import setup from "./";

//tmp: for test
let options = {
  apps: ["ngProject"],
  libs: ["nglib"],
  path: "/myproject"
};

let test = setup(options);
console.log("init:", setup);
console.log("test:", test);
