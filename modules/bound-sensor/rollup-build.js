const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { rollup } = require('rollup');
const uglify = require('rollup-plugin-uglify');
const resolve = require('rollup-plugin-node-resolve');

const moduleName = 'bound-sensor';

const rootDir = path.resolve(__dirname);
const distDir = path.join(rootDir, 'dist');
const tscOut = path.join(rootDir, 'tsc-out');

const buildConfigs = [
  {
    target: 'es2015',
    format: 'es',
    entry: path.join(tscOut, 'es2015/index.js'),
    dest: path.join(distDir, `${moduleName}.js`),
  },
  {
    target: 'es5',
    format: 'es',
    entry: path.join(tscOut, 'es5/index.js'),
    dest: path.join(distDir, `${moduleName}.es5.js`),
  },
  {
    target: 'umd',
    format: 'umd',
    entry: path.join(tscOut, 'es5/index.js'),
    dest: path.join(distDir, `bundles/${moduleName}.js`),
  },
  {
    target: 'umd.minified',
    format: 'umd',
    entry: path.join(tscOut, 'es5/index.js'),
    dest: path.join(distDir, `bundles/${moduleName}.min.js`),
    plugins: [uglify()],
  },
];

Promise.resolve()
  .then(() => {
    console.log('Bundling started...');

    const result = buildConfigs
      .map((config) => {
        console.log(`Bundling for ${config.target}`);

        // Runs rollup to bundle each config
        return rollupWith(config)
          .then((bundle) => {
            bundle.write(Object.assign({
              sourceMap: true,
              moduleName,
            }, config));

            console.log(`${config.target} was generated successfully`);
            return true;
          });
      });

    return Promise.all(result);
  })
  .then(() => Promise.resolve()
    .then(() => _relativeCopy('**/*.d.ts', path.join(tscOut, 'es2015'), distDir))
    .then(() => console.log('Type definitions copied to dist.'))
    .catch((err) => {
      throw new Error(err);
    })
  )
  .then(() => console.log('All done.'))
  .catch((error) => {
    console.error(error);
  });



// Bundles javascript files
function rollupWith({ entry, plugins }) {

  if (!entry || !fs.existsSync(entry)) {
    throw Error('Rollup bundling needs entry path');
  }

  if (typeof plugins !== 'object') {
    plugins = [];
  }

  plugins.push(resolve());

  return rollup({
    entry,
    plugins,
  });
}

// Copy files maintaining relative paths.
function _relativeCopy(pattern, rootDir, toDir) {
  return new Promise((resolve, reject) => {
    glob(pattern, {
      cwd: rootDir,
      nodir: true,
      ignore: ['node_modules/**/*']
    }, (err, files) => {
      if (err) reject(err);
      const results = files.map(file => {
        return new Promise((fileResolve, fileReject) => {
          const origin = path.join(rootDir, file);
          const dest = path.join(toDir, file);

          const rd = fs.createReadStream(origin);
          rd.on('error', (err) => fileReject(`Cannot read ${origin}: ${err}`));
          rd.on('open', () => {
            _recursiveMkDir(path.dirname(dest));

            const wr = fs.createWriteStream(dest);
            wr.on('error', (err) => fileReject(`Cannot write to ${dest}: ${err}`));
            wr.on('close', () => fileResolve(file));

            // Finish the copy
            rd.pipe(wr);
          });
        });
      });

      Promise.all(results)
        .then((values) => {
          if (values.length === files.length) {
            resolve('All files copied successfully.');
          }
        })
        .catch((err) => {
          reject(err);
        })
    });
  });
}

// Recursively create a dir.
function _recursiveMkDir(dir) {
  if (!fs.existsSync(dir)) {
    _recursiveMkDir(path.dirname(dir));
    fs.mkdirSync(dir);
  }
}
