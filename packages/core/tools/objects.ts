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
