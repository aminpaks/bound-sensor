import * as path from 'path';
import { rollup, WriteOptions, Plugin, Warning } from 'rollup';
import { angularCmplFix } from './angular-fix';
import * as commonjs from 'rollup-plugin-commonjs';
import * as nodeResolve from 'rollup-plugin-node-resolve';
import { main as ngc } from '@angular/compiler-cli/src/main';

import { copyFromTo, genIndexBarrel } from './utils';
import {
  buildConfigs,
  distDir,
  es5Dir,
  RollupCustomOptions,
  rootDir,
  sourceLibDir,
} from './configs';

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

    await copyFromTo({ pattern: 'tsconfig-aot*.json', rootDir, toDir: sourceLibDir });
    console.log('Configurations copied.');

    console.log('Ahead-of-time compilation started...');

    halted = await ngc({ project: path.join(sourceLibDir, 'tsconfig-aot.es5.json') }) !== 0;
    if (halted) {
      throw new Error('ES5 compilation halted!');
    }

    halted = await ngc({ project: path.join(sourceLibDir, 'tsconfig-aot.json') }) !== 0;
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
