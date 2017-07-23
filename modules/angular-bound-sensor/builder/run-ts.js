'use strict';
/**
 * Load the TypeScript compiler, then load the TypeScript gulpfile which simply loads all
 * the tasks. The tasks are really inside tools/gulp/tasks.
 */

const fs = require('fs');
const path = require('path');

const tsconfigPath = path.join(__dirname, 'tsconfig.json');
const tsconfig = require(tsconfigPath);

console.log(tsconfigPath, tsconfig);

// Register TS compilation.
require('ts-node').register({
  project: tsconfigPath
});

// // The gulp tsconfig file maps specific imports to relative paths. In combination with ts-node
// // this doesn't work because the JavaScript output will still refer to the imports instead of
// // to the relative path. Tsconfig-paths can be used to support path mapping inside of Node.
// require("tsconfig-paths").register({
//   baseUrl: path.dirname(tsconfigPath),
//   paths: tsconfig.compilerOptions.paths
// });

const script = path.resolve(process.argv.slice(2).shift());

if (fs.existsSync(script)) {
  require(script);
}
