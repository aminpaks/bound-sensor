import * as path from 'path';
import { rollup, Options, WriteOptions, Plugin, Warning } from 'rollup';
import { angularCmplFix } from './angular-fix';
import * as uglify from 'rollup-plugin-uglify';
import * as commonjs from 'rollup-plugin-commonjs';
import * as nodeResolve from 'rollup-plugin-node-resolve';
import { main as ngc } from '@angular/compiler-cli/src/main';

import { copyFromTo, genIndexBarrel } from './utils';

type RollupCustomOptions = Options & WriteOptions;

const defaultConfigs: RollupCustomOptions = {
  moduleName: 'angular-bound-sensor',
  format: 'es',
  entry: '',
  dest: '',
  external: [
    '@angular/core',
    '@angular/common',
    '@angular/compiler',
    '@angular/forms',
    '@angular/platform-browser',
    '@angular/router',
    'rxjs',
    'zone.js',
    // 'bound-sensor',
  ],
  globals: {
    '@angular/core': 'ng.core',
    'bound-sensor': 'BoundSensor',
  },
  onwarn: (warn) => {
    if (warn.code !== 'THIS_IS_UNDEFINED') {
      console.warn(`${warn.code} -- ${warn.message}`);
    }
  },
  sourceMap: true,
};

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const tscOutDir = path.join(rootDir, 'tsc-out');
const sourceLibDir = path.join(tscOutDir, 'lib');

const es5Dir = path.join(tscOutDir, 'lib-es5');
const es2015Dir = path.join(tscOutDir, 'lib-es2015');

const buildConfigs: RollupCustomOptions[] = [{
  ...defaultConfigs,
  format: 'umd',
  entry: path.join(tscOutDir, 'lib-es5/angular-bound-sensor.js'),
  dest: path.join(distDir, 'bundles/angular-bound-sensor.umd.js'),
}, {
  ...defaultConfigs,
  format: 'umd',
  entry: path.join(tscOutDir, 'lib-es5/angular-bound-sensor.js'),
  dest: path.join(distDir, 'bundles/angular-bound-sensor.umd.min.js'),
  plugins: [uglify()],
}, {
  ...defaultConfigs,
  entry: path.join(tscOutDir, 'lib-es5/angular-bound-sensor.js'),
  dest: path.join(distDir, 'angular-bound-sensor.es5.js'),
}, {
  ...defaultConfigs,
  entry: path.join(tscOutDir, 'lib-es2015/angular-bound-sensor.js'),
  dest: path.join(distDir, 'angular-bound-sensor.js'),
}];

async function rollupBy(configs: RollupCustomOptions): Promise<void> {
  const plugins: Plugin[] = [
    nodeResolve({
      main: true,
      jsnext: true,
    }),
    commonjs(),
    angularCmplFix(),
  ];

  if (configs.plugins instanceof Array) {
    configs.plugins = configs.plugins.concat(plugins);
  } else {
    configs.plugins = plugins;
  }
  const result = await rollup(configs);
  await result.write(<WriteOptions>configs);
}

async function Bundler() {
  console.log('Compilation process started.');

  let halted: boolean = false;

  try {

    await copyFromTo({ pattern: '*(tsconfig-aot*.json|index.ts)', rootDir, toDir: sourceLibDir });
    console.log('Configurations copied.');

    console.log('Ahead-of-time compilation started...');

    halted = await ngc({ project: path.join(sourceLibDir, 'tsconfig-aot.es5.json') }) !== 0;
    console.log('ES5 compiled:', !halted);
    if (halted) {
      throw new Error('ES5 compilation halted!');
    }

    halted = await ngc({ project: path.join(sourceLibDir, 'tsconfig-aot.json') }) !== 0;
    console.log('ES2015 compiled:', !halted);
    if (halted) {
      throw new Error('ES2015 compilation halted!');
    }


    for (const config of buildConfigs) {
      const title = config.dest.split(path.sep).pop();

      if (halted) {
        break;
      }

      try {
        await rollupBy(config);

        console.log(`Compiled ${title}`);
      } catch (err) {
        halted = true;
        console.log('halted', halted);
        console.error('Rollup compilation halted:', err);
      }
    }

    await copyFromTo({
      pattern: '**/*(*.d.ts|*.json)', rootDir: es5Dir, toDir: distDir
    });
    console.log('All type definitions copied.');


  } catch (err) {
    console.error('Process halted:', err);
    return;
  }

  console.log('All done.');
}

Bundler();
