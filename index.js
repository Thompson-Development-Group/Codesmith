const npm = require('npm'),
  fs = require('fs').promises,
  parser = require('comment-parser'),
  path = require('path'),
  chokidar = require('chokidar'),
  resolve = require('path').resolve
 const debug = (program, m) => {
  if (!program.debug) return;
  console.log(JSON.stringify(m))
}
 // Require local dependencies
const script = require('./script')
 /**
 * Initialize!
 * 
 * @param {Object} program Commander's original object
 */
const init = async (program) => {
  debug(program, `Init. Program file: ${program.file}`)
   program.file = path.resolve(program.file)
   // Only execute if the target file exists
  try {
    await fs.access(program.file)
  } catch (error) {
    console.error(program.file)
    throw new Error('file-not-found')
  }
   debug(program, 'File found')
   // Initialize path-related variables
  const targetPath = path.dirname(resolve(program.file))
   debug(program, `Target path: ${targetPath}`)
   const run = async () => {
    const contents = await fs.readFile(program.file, 'utf-8')
    const packageExists = await fs.access(`${targetPath}/package.json`).then(() => true).catch(() => false)
     debug(program, `Package file exists: ${packageExists}`)
     // If there's an existing package.json file for the specified file,
    // skip the dependencies installation and execute the script.
    if (packageExists) {
      debug(program, 'A package.json file already exists.')
      debug(program, 'Skipping dependencies installation.')
      return script.execute(program, targetPath)
    }
     debug(program, `Parse comments...`)
     // Parse the comments for the targeted file
    const comments = parser(contents)
     // Hold a list of dependencies, as in:
    // [ "package@version" ]
    let dependencies = []
     // Find the comment that contains the dependencies
    const dependenciesComments = comments.filter(comment => {
      return (comment.tags || []).find(t => t.tag === 'dependency')
    })
     // If there's no dependencies comment, execute the script normally.
    if (!dependenciesComments) {
      debug(program, 'No dependencies comment found. Executing script.')
      return script.execute(program, targetPath)
    }
     // For all the js-doc tags found in the dependencies comment, grab and parse
    // only the ones that contain actual requirements.
    dependenciesComments.map(dc => {
      dc.tags.map(tag => {
        if (tag.tag !== 'dependency') return;
        debug(program, `Adding dependency ${tag.name}@${tag.description}`)
        dependencies.push(`${tag.name}@${tag.description}`)
      })
    })
     // If there are no dependencies found in the comment, execute the script
    // normally
    if (!dependencies.length) {
      debug(program, 'No dependencies comment found. Executing script.')
      return script.execute(program, targetPath)
    }
     if (program.dryrun) {
      // Remove the node_modules folder to ensure a clean execution
      debug(program, 'Performing dry run')
      await fs.rm(`${targetPath}/node_modules`, { recursive: true, force: true })
      await fs.unlink(`${targetPath}/package-lock.json`).catch(() => {})
    }
     debug(program, 'Init main promise')
     return new Promise((resolve, reject) => {
      debug(program, 'Created main promise')
      // Init npm package
      npm.load({
        prefix: targetPath
      }, () => {
        debug(program, 'npm loaded')
        // Install the dependencies
        script
          .executeNpm(['install', '--silent', '--no-audit', '--no-progress', '--no-save'].concat(dependencies), targetPath)
          .then(() => {
            debug(program, 'Dependencies installed. Running now')
            return script.execute(program, targetPath)
              .then(result => {
                if (program.watch) {
                  console.log('Clean exit - waiting for file changes to restart')
                }
                resolve(result)
              })
              .catch(ex => {
                debug(program, 'Script execution error')
                if (program.watch) {
                  console.log('Error - waiting for file changes to restart')
                }
              })
          })
          .catch(ex => {
            debug(program, 'NPM error')
            debug(program, ex)
          })
      })
    })
  }
   if (program.watch) {
    debug(program, 'Watching for changes')
    chokidar.watch(program.file, {
        persistent: true
      })
      .on('change', path => {
        console.log('Changes detected - restarting')
        run()
      })
  }
  debug(program, 'nodemon-like integration disabled')
   return run()
}
 module.exports.init = init