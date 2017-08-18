import MagicString from 'magic-string';
import { Plugin, SourceMap } from 'rollup';

const importRegex = /(import|export)\s*((\{[^}]*\}|\*)(\s*as\s+\w+)?(\s+from)?\s*)?([`'"])(.*)\6/ig;

export function angularCmplFix() {

  function fixImportee(id: string) {
    const parts = id.split(/[\/\\]/);
    const first = [...parts].shift();
    const last = parts.pop();

    if (first[0] !== '.' && last === 'index') {
      return parts.join('/');
    }
  }

  const plugin: Plugin = {
    name: 'angular-fix',
    transform: function (code) {
      const source = new MagicString(code);

      let hasUpdate = false;
      let match;

      while ((match = importRegex.exec(code)) !== null) {
        const moduleId = match[7];
        const fix = fixImportee(moduleId);

        if (moduleId && fix) {
          hasUpdate = true;

          const start = match.index;
          const end = start + match[0].length;
          const replacement = code.substring(start, end).replace(moduleId, fix);

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
