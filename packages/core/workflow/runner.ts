import { argv } from "process";
import * as tools from "../tools";

const args = require("minimist")(argv.slice(2));

export interface ExecOptions {}
export interface InstallOptions {}

//add a new hook ex: hook(install,(builder,options)=>console.log("installing"+builder),"pre")
export function hook(fn, exec, place = "pre") {}

export function exec(builder: string, options: ExecOptions) {}

export function install(builder: string, options: InstallOptions) {}
