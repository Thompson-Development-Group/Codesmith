/**
 * The following example is using a module called '../' and initializing it with some options.
 * It sets the file to 'file.js' and sets an environment variable called CHARACTER to 'Jeff Jeebus'.
 * It then calls the .then() method on the result of the initialization and logs the result to the console after converting it to a JSON string with indentation of 2 spaces.
 */
require("../")
  .init({
    file: "file.js",
    env: {
      CHARACTER: "Jeff Jeebus",
    },
  })
  .then((result) => console.log(JSON.stringify(result, " ", 2)));
