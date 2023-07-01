const path = require("path");
const { spawn } = require("child_process");
const debug = (m) => {
  console.log(JSON.stringify(m));
};

const execute = async (program, targetPath) => {
  return new Promise((resolve, reject) => {
    // Set environment variables
    const env = { ...process.env, ...(program.env || {}) };
    if (program.method) {
      try {
        let lib = require(path.resolve(program.file));
        resolve(lib[program.method](...(program.methodArgs || [])));
      } catch (ex) {
        reject(ex);
      } finally {
        delete require.cache[path.resolve(program.file)];
      }
      return;
    }
    let child = spawn("node", [path.resolve(program.file)], { env });
    let stdLines = [];
    child.stdout.on("data", (data) => {
      const date = new Date();
      const lines = data.toString().replace(/\n$/, "").split("\n");
      lines.forEach((r) => {
        stdLines.push({ output: r, err: false, date });
        if (program.cli) {
          console.log(r);
        }
      });
    });
    child.stderr.on("data", (data) => {
      const date = new Date();
      const lines = data.toString().replace(/\n$/, "").split("\n");
      if (!program.cli) {
        lines.forEach((r) => {
          stdLines.push({ output: r, err: true, date });
        });
      } else {
        console.error(data.toString());
      }
    });
    child.on("close", (code) => {
      code > 0 ? reject({ stdLines, code }) : resolve({ stdLines, code });
      if (program.debug) debug({ stdLines, code });
    });
  });
};

module.exports.execute = execute;
const executeNpm = (args, cwd) => {
  return new Promise((resolve, reject) => {
    const sanitizedArgs = args.map((arg) => arg.toString());
    let child = spawn(/^win/.test(process.platform) ? "npm.cmd" : "npm", sanitizedArgs, { stdio: null, cwd });
    child.on("close", (code) => {
      code > 0 ? reject(new Error(`NPM command failed with exit code ${code}`)) : resolve();
    });
  });
};
module.exports.executeNpm = executeNpm;
