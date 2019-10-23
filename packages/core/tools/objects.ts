export * from "@angular-devkit/core"; //{ strings, normalize }

export function objectType(obj: any): string {
  //from: eldeeb/src/index.ts https://github.com/goblins-tech/eldeeb/blob/master/src/index.ts
  //todo: move to @eldeeb/utils
  return Object.prototype.toString
    .call(obj)
    .replace("[object ", "")
    .replace("]", "")
    .toLowerCase();
  /*
    examples:
   {} => object
   [] => array
   null => null
   function(){} => function
   1 => number
   "x", 'x', `x` => string
   */
}

//merge options with defaultOptions, remove null values (ex: {x:null} -> remove x from defaultOptions)
export function merge(
  options,
  defaultOptions: {} | boolean,
  removeNull = true
) {
  if (objectType(defaultOptions) == "object") {
    //note that: also ([] instanceof Object)==true
    options = Object.assign(defaultOptions, options);
  } else removeNull = defaultOptions;

  if (removeNull !== false) {
    for (let k in options) {
      if (options.hasOwnProperty(k) && options[k] === null) delete options[k];
    }
    return options;
  }
}
