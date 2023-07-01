/**
 * The following example is a module that exports a handler function. The handler function takes in two parameters and returns an object containing those parameters along with four additional properties: a, b, c, and d. If either of the parameters is not provided, it will default to null.
    1. The code exports a single function called "handler" using the "module.exports" syntax. This function is the entry point of the module.
    2. The "handler" function takes in two parameters: "firstParameter" and "secondParameter".
    3. Inside the function, a new object called "result" is created.
    4. The "result" object is assigned with the values of the parameters "firstParameter" and "secondParameter". If either of the parameters is not provided (i.e., falsy), it will default to null.
    5. The "result" object is also assigned with four additional properties: a, b, c, and d. These properties have fixed values of 1, 2, 3, and 4 respectively.
    6. Finally, the "result" object is returned from the "handler" function.
 */
module.exports.handler = (firstParameter, secondParameter) => {
  const result = {
    firstParameter: firstParameter || null,
    secondParameter: secondParameter || null,
    a: 1,
    b: 2,
    c: 3,
    d: 4,
  };
  return result;
};
