/*
workflow steps:
1- for new projects run ./init to create the final autoDev object
2- run ./planner to create the plan array, which include ./runner functions and hooks
 */

import validate from "./validate"; //validates auto-developer.js
import init from "./init"; //creates the used version of it (i.e: auto-developer-used.json), it uses ./validate internally
import planner from "./planner"; //creats the WF plan object
import * as runner from "./runner"; //executes the WF plan, i.e: contain the implementation for every function

export { init, planner, runner };
