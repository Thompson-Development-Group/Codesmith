/**
 * The following example performs the following tasks:
    1. It uses the forEach method to iterate over each element in the array [1, 2, 3, 4] and logs each element to the console.
    2. It checks if the environment variable "CHARACTER" is set using the process.env object. If the variable is not set, it assigns the value "Not set" to the variable "character".
    3. It logs the value of the "CHARACTER" environment variable to the console.
    4. It requires the "faker" module and uses the fakeName function to generate a fake name in the format "{{name.lastName}}, {{name.firstName}}".
    5. It logs the generated fake name to the console.
 */
[1, 2, 3, 4].forEach((n) => console.log(n));
const character = process.env.CHARACTER || "Not set";
console.log(`Environment variable "CHARACTER": ${character}`);
/**
 * @dependency faker latest
 */
const fakeName = require("faker").fakeName;
const fake = fakeName("{{name.lastName}}, {{name.firstName}}");
console.log(fake);
