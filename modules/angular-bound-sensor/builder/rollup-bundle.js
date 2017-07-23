'use strict';

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const ngc = require('@angular/compiler-cli/src/main').main;
const rollup = require('rollup');
const uglify = require('rollup-plugin-uglify');

const libNameWithScope = require('./package.json').name;
const libName = libNameWithScope.indexOf('/') > -1 ? libNameWithScope.slice(libNameWithScope.indexOf('/') + 1) : libNameWithScope;
const rootFolder = path.join(__dirname);
const compilationFolder = path.join(rootFolder, 'tsc-out');
const srcFolder = path.join(rootFolder, '.');
const distFolder = path.join(rootFolder, 'dist');
const tempLibFolder = path.join(compilationFolder, 'lib');
const es5OutputFolder = path.join(compilationFolder, 'lib-es5');
const es2015OutputFolder = path.join(compilationFolder, 'lib-es2015');

const rollupBaseConfig = require('./rollup.config')(libName);

return Promise.resolve()
  // Copy library to temporary folder and inline html/css.
  .then(() => _relativeCopy(`**/tsconfig-aot*.json`, srcFolder, tempLibFolder)
    .then(() => console.log('Configurations copied.'))
  )
  // Compile to ES5.
  .then(() => ngc({ project: `${tempLibFolder}/tsconfig-aot.es5.json` })
    .then(exitCode => exitCode === 0 ? Promise.resolve() : Promise.reject())
    .then(() => console.log('NGC: ES5 compilation succeeded.'))
  )
  // Compile to ES2015.
  .then(() => ngc({ project: `${tempLibFolder}/tsconfig-aot.json` })
    .then(exitCode => exitCode === 0 ? Promise.resolve() : Promise.reject())
    .then(() => console.log('NGC: ES2015 compilation succeeded.'))
  )
  // Bundle lib.
  .then(() => {
    // Base configuration.
    const es5Entry = path.join(es5OutputFolder, `${libName}.js`);
    const es2015Entry = path.join(es2015OutputFolder, `${libName}.js`);

    // UMD bundle.
    const umdConfig = Object.assign({}, rollupBaseConfig, {
      entry: es5Entry,
      dest: path.join(distFolder, `bundles`, `${libName}.umd.js`),
      format: 'umd',
    });

    // Minified UMD bundle.
    const minifiedUmdConfig = Object.assign({}, rollupBaseConfig, {
      entry: es5Entry,
      dest: path.join(distFolder, `bundles`, `${libName}.umd.min.js`),
      format: 'umd',
      plugins: rollupBaseConfig.plugins.concat([uglify({})])
    });

    // ESM+ES5 flat module bundle.
    const fesm5config = Object.assign({}, rollupBaseConfig, {
      entry: es5Entry,
      dest: path.join(distFolder, `${libName}.es5.js`),
      format: 'es'
    });

    // ESM+ES2015 flat module bundle.
    const fesm2015config = Object.assign({}, rollupBaseConfig, {
      entry: es2015Entry,
      dest: path.join(distFolder, `${libName}.js`),
      format: 'es'
    });

    const allBundles = [
      umdConfig,
      minifiedUmdConfig,
      fesm5config,
      fesm2015config,
    ].map(cfg => rollup.rollup(cfg).then(bundle => bundle.write(cfg)));

    return Promise.all(allBundles)
      .then(() => console.log('All bundles generated successfully.'))
  })
  // Copy typings and metadata to `dist/` folder.
  .then(() => Promise.resolve()
    .then(() => _relativeCopy('**/*.d.ts', es2015OutputFolder, distFolder))
    .then(() => _relativeCopy('**/*.metadata.json', es2015OutputFolder, distFolder))
    .then(() => console.log('Typings and metadata copy succeeded.'))
  )
  // Copy package files
  .then(() => Promise.resolve()
    // .then(() => _relativeCopy('LICENSE', rootFolder, distFolder))
    // .then(() => _relativeCopy('package.json', rootFolder, distFolder))
    // .then(() => _relativeCopy('README.md', rootFolder, distFolder))
    .then(() => console.log('Package files copy succeeded.'))
  )
  .catch(e => {
    console.error('\Build failed. See below for errors.\n');
    console.error(e);
    process.exit(1);
  });


// Copy files maintaining relative paths.
function _relativeCopy(fileGlob, from, to) {
  return new Promise((resolve, reject) => {
    glob(fileGlob, {
      cwd: from,
      nodir: true,
      ignore: ['node_modules/**/**']
    }, (err, files) => {
      if (err) reject(err);
      files.forEach(file => {
        const origin = path.join(from, file);
        const dest = path.join(to, file);
        const data = fs.readFileSync(origin, 'utf-8');
        _recursiveMkDir(path.dirname(dest));
        fs.writeFileSync(dest, data);
        resolve();
      })
    })
  });
}

// Recursively create a dir.
function _recursiveMkDir(dir) {
  if (!fs.existsSync(dir)) {
    _recursiveMkDir(path.dirname(dir));
    fs.mkdirSync(dir);
  }
}
