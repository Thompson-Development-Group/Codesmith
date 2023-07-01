# Codesmith

CodeSmith is a Single File Code (SFC) Executor that runs package-free node scripts

> A SFC allows to execute NodeJS scripts and methods with its dependencies.
> defined in the script itself. Either via cli or via module (See examples)

Instead of having a package.json file and installing the dependencies via npm
commands, you can specify the dependencies in your script comments.

CodeSmith will take care of installing the dependencies.

```javascript
[1, 2, 3, 4].forEach((n) => console.log(n));
const character = process.env.CHARACTER || "Not set";
console.log(`Environment variable "CHARACTER": ${character}`);
/**
 * @dependency faker latest
 */
const fakeName = require("faker").fakeName;
const fake = fakeName("{{name.lastName}}, {{name.firstName}}");
console.log(fake);
```

It supports `--watch` for your development-phase things.

## Installation

Use your terminal to install sfc as a globally available package.

```bash
npm i codesmith -g
```

## Cli usage

```bash
Usage: codesmith [options] <file>

Options:
  -V, --version  output the version number
  -d, --dryrun   Removes node_modules and package-lock.json before installing dependencies.
  --debug        Enables debug messages.
  -w, --watch    Watch for changes in the file
  --noupdate     Opt-out of update version check
  -h, --help     display help for command

Example:
  $ codesmith --watch example/file.js

Specifying dependencies:
  /**
   * @dependency lodash latest
   */
```

To get help, execute:

```bash
codesmith -h
```

## Library usage

You can invoke a JS file in two different ways.

### Invoking a specific method (like in AWS Lambda)

This will return the method's result - as it is.

```javascript
let lib = require("codesmith");

let r = await lib.init({
  method: "handler", // Name of the method to be executed
  methodArgs: ["hello", "world"], // List of parameters to apply
  file: "./export-handler.js",
});

console.log(r);

// { firstParameter: 'hello', secondParameter: 'world' }
```

The `init` method returns a Promise with the method's result.

### Executing an entire NodeJS script

This will return the full std output as an array.

```javascript
require("codesmith")
  .init({
    file: "my_javascript_file.js", // File to execute
    env: {
      // Optional k->v pairs of custom environment variables
      CHARACTER: "Jackson Jeebus",
    },
  })
  .then((result) => console.log({ result }));

/*
  {
    "stdLines": [
      {
        "output": "1",
        "err": false,
        "date": "2023-07-12T11:30:00.821Z"
      },
      {
        "output": "2",
        "err": false,
        "date": "2023-07-12T11:30:00.821Z"
      },
      {
        "output": "3",
        "err": false,
        "date": "2023-07-12T11:30:00.821Z"
      },
      {
        "output": "4",
        "err": false,
        "date": "2023-07-12T11:30:00.821Z"
      },
      {
        "output": "Jeff, Johnson",
        "err": false,
        "date": "2023-07-12T11:47:23.063Z"
      }
    ],
    "code": 0
  }
*/
```

The `init` method returns a Promise with an object with the properties:

- `stdLines` is an array of objects containing the STD outputs for both
  errors and logs. In the same order as they were triggered.
  - `output` string - the actual text logged
  - `err` boolean - determines if the log was sent to std-err or not
- `code` number - the execution exit code.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
