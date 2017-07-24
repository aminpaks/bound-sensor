import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';

// Copy files maintaining relative paths.
export function copyFromTo({ pattern, rootDir, toDir, excludes = [] } : {
  pattern: string;
  rootDir: string;
  toDir: string;
  excludes?: string[];
}): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    glob(pattern, {
      cwd: rootDir,
      nodir: true,
      ignore: ['node_modules/**/*'].concat(excludes),
    }, (err, files) => {

      // Rejects on error
      if (err) {
        reject(err);
      }

      const results = files.map(file => {
        return new Promise<string>((fileResolve, fileReject) => {
          const origin = path.join(rootDir, file);
          const dest = path.join(toDir, file);

          const rd = fs.createReadStream(origin);
          rd.on('error', (err) => fileReject(`Cannot read ${origin}: ${err}`));
          rd.on('open', () => {
            mkdir(path.dirname(dest));

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
            resolve(true);
          }
        })
        .catch((err) => {
          reject(err);
        })
    });
  });
}

// Recursively create a dir.
export function mkdir(dir) {
  if (!fs.existsSync(dir)) {
    mkdir(path.dirname(dir));
    fs.mkdirSync(dir);
  }
}

//
export function genIndexBarrel(folderPath: string, from: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(folderPath, 'index.ts'), `export * from '${from}';\n`, 'utf8', (err) => {
      if (err) {
        reject(err);
      }

      resolve(true);
    });
  });
}
