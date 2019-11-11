const { execSync } = require("child_process");
const {
  readdirSync,
  existsSync,
  lstatSync,
  unlinkSync,
  rmdirSync,
  mkdirSync,
  copyFileSync
} = require("fs");
const { cwd, chdir, argv } = require("process");
const { join } = require("path");
var cpx = require("cpx"); //or ncp: https://www.npmtrends.com/copy-vs-copyfiles-vs-cp-vs-cpx-vs-ncp-vs-npm-build-tools

const dir = cwd(),
  buildersSrc = join(dir, "packages/builders/"),
  buildersDist = join(dir, "dist/packages/builders/"),
  coreSrc = join(dir, "packages/core/"),
  coreDist = join(dir, "dist/packages/core/");

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
  //path = path ? join(dir, path) : dir; //  path = dir + path ? "/" + path : "";
  path = path || dir;
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
  return exec(
    "npm " +
      cmd +
      (!noSilent ? " --silent" : "") +
      " --no-audit --global-style",
    std
  );
}

function del(path) {
  if (path instanceof Array) return from.forEach(p => del(p));
  if (!existsSync(path)) return;
  if (lstatSync(path).isDirectory()) {
    readdirSync(path).forEach(file => {
      const curPath = join(path, file);
      if (lstatSync(curPath).isDirectory()) del(curPath);
      else unlinkSync(curPath);
    });
    rmdirSync(path);
  } else unlinkSync(path);
}

function copy(from, to, execlude) {
  if (from instanceof Array)
    return from.forEach(path => copy(path, to, execlude));
  if (
    !existsSync(from) ||
    from.match(execlude || /\/?node_modules\/?|(?<!\/files)\/\w+?\.ts$/)
  )
    return;
  //execlude node_modules and *.ts (already compiles with typescript), except template files (i.e: inside **/files/**)
  //regex: /?node_modules/? or ...
  // (?<!\/files)\/ negative lookahead, don't make (..\/) so it may match filesX.ts ..
  // \w+? .+? one ore more word-charachter (lazy), using .+? failed with /files/file.ts
  // .ts (i.e: *.ts not precceeded by /files/ )
  /*
  todo: needs testing againest:
   aa/file.ts (match: .ts)
   aa/file.js (not match: none-ts)
   aa/files/file.js (not match: none-ts)
   aa/files/file.ts (not match: /files/) <------------ shouldn't match, (?<!...)file\.ts dosen't match
   node_modules/aa/file.ts (match: node_modules)
   node_modules/aa/file.js
   node_modules/aa/files/file.ts
   node_modules/aa/files/file.js
   */
  if (lstatSync(from).isDirectory()) {
    readdirSync(from).forEach(file => {
      const curFrom = join(from, file);
      const curTo = join(to, file);
      if (lstatSync(curFrom).isDirectory()) copy(curFrom, curTo, execlude);
      else {
        if (!existsSync(curTo)) {
          mkdirSync(to, { recursive: true });
          copyFileSync(curFrom, curTo);
        }
      }
    });
  } else copyFileSync(from, to);
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
  exec("tsc -p tsconfig.json " + (watch ? "-w" : "" + " >build.log"), true);

  //copy files that will don't be compiled via typescript  to `dist`
  //i.e !(*.ts) and /files/**
  //exec("npx cpx packages/**/!(*.ts) dist/packages" + (watch ? "-w" : ""));
  console.log(">> copying files ... \n");
  //todo: use regex, don't extend the glob pattern (i.e {a,b,c}) because it will make it executed multiple times, once per each element; !(a|b|c)
  //cpx.copySync("packages/**/{!(*.ts),files/**,!(node_modules/**)}","dist/packages",{includeEmptyDirs: true //include empty dirs inside files/**});
  copy("packages", "dist/packages");

  //installing dependencies:
  // we don't need to `npm pack dist/packages/core`,
  //we can install the folder itself in every builder package `npm i distpackages/core`
  //or `npm link src/packages/core` or `npm link dist/packages/core`  console.log(">> installing dependencies ... \n");

  /*
   cd(coreSrc);
   npm(`link`);
  */
  cd(buildersDist + "builder-builder");
  npm(`i --no-save ../nodejs-builder`);
  //don't save the local pack in package.json
  //todo: prevent npm from installing all dependencies from package.json

  readdirSync(buildersDist).forEach(builder => {
    if (!isPackage(buildersDist + builder)) return;
    cd(buildersDist + builder);
    npm(`i --no-save  ../../core`);
    //  npm("i");
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
      var path = join(
        dir,
        `./dist/packages/${pkg == "core" ? "core" : "builders/" + pkg}`
      );
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
    readdirSync(buildersDist).forEach(builder => {
      if (isPackage(buildersDist + builder)) publish(file);
    });
  }
}
