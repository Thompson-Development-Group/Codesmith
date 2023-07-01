#!/usr/bin/env node
const program = require("commander");
const pkg = require("./package.json");
// cli parameter parsing and --help symlink
program
  .version(pkg.version)
  .arguments("<file>")
  .option("-d, --dryrun", "Removes node_modules and package-lock.json before installing dependencies.")
  .option("--debug", "Enables debug messages.")
  .option("-w, --watch", "Watch for changes in the file")
  .option("--noupdate", "Opt-out of update version check")
  .on("--help", () => {
    console.log("");
    console.log("Example:");
    console.log("  $ codesmith --watch example/file.js");
    console.log("");
    console.log("Specifying dependencies:");
    console.log("  /**");
    console.log("   * @dependency lodash latest");
    console.log("   */");
  })
  .parse(process.argv);
if (!program.args[0]) {
  program.outputHelp();
  process.exit(1);
}
if (!program.noupdate) {
  // Checks for available updates
  const updateNotifier = require("update-notifier");
  const notifier = updateNotifier({
    pkg,
    updateCheckInterval: 1000 * 60 * 60 * 24 * 2,
  });
  notifier.notify({ defer: false });
}
const codesmith = require(".");
codesmith.init(Object.assign({}, program, { file: program.args[0], cli: true }));
