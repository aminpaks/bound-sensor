
'use strict';

const camelCase = require('camelcase');
const commonjs = require('rollup-plugin-commonjs');
const sourcemaps = require('rollup-plugin-sourcemaps');
const nodeResolve = require('rollup-plugin-node-resolve');

module.exports = (libName) => {
  return {
    moduleName: camelCase(libName),
    sourceMap: true,
    // ATTENTION:
    // Add any dependency or peer dependency your library to `globals` and `external`.
    // This is required for UMD bundle users.
    globals: {
      // The key here is library name, and the value is the the name of the global variable name
      // the window object.
      // See https://github.com/rollup/rollup/wiki/JavaScript-API#globals for more.
      // '@angular/core': 'ng.core'
      "@angular/common": "ng.common",
      "@angular/compiler": "ng.compiler",
      "@angular/core": "ng.core",
      "@angular/forms": "ng.forms",
      "@angular/platform-browser": "ng.platform_browser",
      "@angular/router": "ng.router",
      "lodash": "lodash",
      "rxjs": "rxjs",
      "zone.js": "zone.js"
    },
    external: [
      // List of dependencies
      // See https://github.com/rollup/rollup/wiki/JavaScript-API#external for more.
      "@angular/common",
      "@angular/compiler",
      "@angular/core",
      "@angular/forms",
      "@angular/platform-browser",
      "@angular/router",
      "lodash",
      "rxjs",
      "zone.js"
    ],
    plugins: [
      sourcemaps(),
      nodeResolve({ jsnext: true, module: true }),
      commonjs({ include: 'node_modules/rxjs/**' }),
    ]
  };
};
