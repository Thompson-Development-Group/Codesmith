/**
 * The following example is an asynchronous function that uses the  `await`  keyword to wait for a promise to be resolved before continuing execution. 
    1. The code first requires a module named  `lib`  from a relative path.
    2. It then calls the  `init`  function of the  `lib`  module with an object as an argument.
    3. The object has properties  `method` ,  `methodArgs` , and  `file`  which are used as arguments for the  `init`  function.
    4. The  `init`  function is expected to return a promise, which is awaited using the  `await`  keyword.
    5. The resolved value of the promise is stored in the variable  `r` .
    6. Finally, the value of  `r`  is logged to the console.
 */
(async () => {
  let lib = require("..");

  let r = await lib.init({
    method: "handler",
    methodArgs: ["hello", "world"],
    file: "./export-handler.js",
  });

  console.log(r);
})();
