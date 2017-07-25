import MagicString from 'magic-string';
import { Plugin, SourceMap } from 'rollup';

const importRegex = /(import|export)\s*((\{[^}]*\}\s*)|(\w+\s*))from\s*['"]([^'"]+)['"]/ig;

export function angularCmplFix() {

  function fixImportee(id) {
    const parts = id.split(/[\/\\]/);
    const first = parts.slice(0).shift();
    const last = parts.pop();

    if (first !== '.' && last === 'index') {
      return parts.join('/');
    }
  }

  const plugin: Plugin = {
    name: 'rollup-plugin-angular-cmpl-fix',
    transform: function (code) {
      const source = new MagicString(code);

      let hasUpdate = false;
      let match;

      while ((match = importRegex.exec(code)) !== null) {
        const moduleId = match[5];
        const fix = fixImportee(moduleId);

        if (moduleId && fix) {
          hasUpdate = true;

          const start = match.index;
          const end = start + match[0].length;
          const replacement = code.substr(start, end).replace(moduleId, fix);

          source.overwrite(start, end, replacement);
        }
      }

      if (hasUpdate) {
        const code = source.toString();
        const map = <SourceMap><any>source.generateMap({ hires: true });

        return {
          code,
          map,
        }
      }
    }
  }

  return plugin;
}
