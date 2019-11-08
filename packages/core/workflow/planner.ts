/*
todo: the workflow plan will be different for every signal (i.e: init, update, test, e2e, ...)
 */

export default function(config: AutoDevConfig, signal: string) {
  var plan = []; //ex: [install([builders]), run(builder1), doSomething(builder1)]
  return plan;
}
