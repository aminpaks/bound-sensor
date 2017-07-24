import * as path from 'path';
import * as uglify from 'rollup-plugin-uglify';
import { Options, WriteOptions } from 'rollup';

export type RollupCustomOptions = Options & WriteOptions;

export const defaultConfigs: RollupCustomOptions = {
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
    'bound-sensor',
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

export const rootDir = path.resolve(__dirname, '..');
export const distDir = path.join(rootDir, 'dist');
export const tscOutDir = path.join(rootDir, 'tsc-out');
export const sourceLibDir = path.join(tscOutDir, 'lib');

export const es5Dir = path.join(tscOutDir, 'lib-es5');
export const es2015Dir = path.join(tscOutDir, 'lib-es2015');

export const buildConfigs: RollupCustomOptions[] = [{
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
