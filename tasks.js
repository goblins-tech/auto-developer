const { execSync } = require("child_process");
const {
  readdirSync,
  existsSync,
  lstatSync,
  unlinkSync,
  rmdirSync
} = require("fs");
const { cwd, chdir, argv } = require("process");
const { join } = require("path");
var cpx = require("cpx"); //or ncp: https://www.npmtrends.com/copy-vs-copyfiles-vs-cp-vs-cpx-vs-ncp-vs-npm-build-tools

const dir = cwd();
var buildersDir = "./dist/packages/builders/";

//todo: use `yargs` or `inquirer` to parse argv
const task = argv.slice(2)[0] || "build"; //todo: `cmd` (i.e without --) >task cmd --arg1 --arg2

console.log(`>> task: ${task}`);
if (task == "build") build(...argv.slice(3));
//todo: >... build -w ==> build(true)
else if (task == "publish") publish(...argv.slice(3));
//todo: parse args >node task publish pkg1 pkg2 --v=patch ==> publish([pkg1,pkg2],v)
else if (task == "tmp") tmp(...argv.slice(3));

//just for tests
function tmp(a, b, c) {
  console.log("argv:", a, b, c);
}

//------------- helpers ----------------
function cd(path) {
  path = path ? join(dir, path) : dir; //  path = dir + path ? "/" + path : "";
  console.log(">> chdir " + path + "\n");
  chdir(path);
}

function exec(cmd, std) {
  console.log(">> " + cmd + "\n");

  if (std === true) std = [0, 1, 2];
  if (std) std = { stdio: std }; //https://stackoverflow.com/a/43962747

  try {
    return execSync(cmd, std);
  } catch (err) {
    if (!std) console.error(err); //err.stdout.toString()
  }
}

function npm(cmd, noSilent, std) {
  return exec("npm " + cmd + (!noSilent ? " --silent" : ""), std);
}

function del(path) {
  if (existsSync(path)) {
    readdirSync(path).forEach(file => {
      const curPath = join(path, file);
      if (lstatSync(curPath).isDirectory()) del(curPath);
      else unlinkSync(curPath);
    });
    rmdirSync(path);
  }
}

function isPackage(path) {
  return existsSync(path + "/package.json");
}
//------------- /helpers ----------------
function build(watch) {
  //create 'dist' (by running tsc & cpx) then pack `core` and install it into every builder

  //remove `dist` folder
  //exec("if exist dist rmdir dist /s /Q"); //will NOT remove non-empty sub-dirs
  console.log(">> del ./dist \n");
  del("./dist");

  //compile typescript
  exec("tsc -p tsconfig.json " + (watch ? "-w" : ""), true);

  //copy files that will don't be compiled via typescript  to `dist`
  //i.e !(*.ts) and /files/**
  //exec("npx cpx packages/**/!(*.ts) dist/packages" + (watch ? "-w" : ""));
  console.log(">> cpx ... \n");
  cpx.copySync("packages/**/{!(*.ts),files/**}", "dist/packages", {
    includeEmptyDirs: true //include empty dirs inside files/**
  });

  //pack the `core` pkg and install it into all builders
  //also install project-builder in builder-builder
  cd();
  var core = npm("pack ./dist/packages/core").toString();
  var projectBuilder = npm(
    "pack ./dist/packages/builders/project-builder"
  ).toString();

  cd(buildersDir + "/builder-builder");
  npm(`i -D ${dir}/${projectBuilder}`);

  cd("./dist/packages/core");
  npm(`i`); //install all dependencies

  readdirSync(buildersDir).forEach(builder => {
    if (!isPackage(buildersDir + builder)) return;
    cd(buildersDir + builder);
    npm(`i -D ${dir}/${core}`); //todo: install into every package
    npm("i");
  });
}

function publish(pkg, version) {
  //increase the version of every package then publish them
  if (!version) version = "patch";
  if (pkg) {
    if (pkg instanceof Array) {
      pkg.forEach(p => publish(p, version));
    } else {
      console.log(">> publishing: " + pkg + "\n");
      var path = `./dist/packages/${
        pkg == "core" ? "core" : "builders/" + pkg
      }`;
      if (!isPackage(join(dir, path)))
        return console.error(
          "publish: " + pkg + " dosen't include a package.json file"
        );
      cd(path);
      npm(`version ${version} --force`); //force increasing pkg's version even if the git is not clean (i.e unstaged changes existing)
      npm("publish  --access=public", false, true);
    }
  } else {
    //publish all packages
    publish("core");
    readdirSync(buildersDir).forEach(builder => {
      if (isPackage(buildersDir + builder)) publish(file);
    });
  }
}
