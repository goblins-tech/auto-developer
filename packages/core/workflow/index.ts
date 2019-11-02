export * from "./planner"; //creats the WF plan object
export * from "./runner"; //runs the WF plan
export * from "./executer"; //executes the WF plan, i.e: contain the implementation for every function

/*
example:

var plan=[
  runner.install("builder1"), // {ex.install.pre(..); ex.install.on(..); ex.install.post()}
  runner.exec("builder1"),
]
 */
