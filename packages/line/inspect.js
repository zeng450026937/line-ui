const fs = require('fs');
const path = require('path');
const glob = require('glob');
const pkg = require('./package.json');

const pkgName = pkg.name;
const pkgDir = path.resolve(__dirname, '.');
const resolve = p => path.resolve(pkgDir, p);
const relative = (from, to) => path.relative(from, to).split('\\').join('/');
const basename = p => path.basename(p, path.extname(p));

const { matchWIP, camelize, debounce } = require('./scripts/utils');

const isDev = `${ process.env.LINE_DEV }` === 'true';

const imports = new Map();
const effects = new Map();
let components = [];
let directives = [];

const lookup = {
  components : () => {
    const root = resolve('src/components');

    glob.sync('*/*.tsx', { cwd: root })
      .filter(p => !matchWIP(`${ root }/${ p }`))
      .forEach(p => {
        const shortname = basename(p);
        const name = camelize(`-${ shortname }`);
        const file = `${ pkgName }/${ relative(pkgDir, `${ root }/${ p.replace('.tsx', '') }`) }`;

        imports.set(name, file);

        const dir = path.dirname(p);
        const cwd = resolve(isDev ? `src/components/${ dir }` : `dist/style/${ dir }`);
        const pattern = isDev ? `${ shortname }*.scss` : `${ shortname }*.css`;
        const ignore = ['*.vars.scss', '*.min.css'];

        glob.sync(pattern, { cwd, ignore })
          .forEach(p => {
            const style = `${ pkgName }/${ relative(pkgDir, `${ cwd }/${ p }`) }`;
            const parts = p.split('.');
            const theme = parts.length > 2 ? parts[parts.length - 2] : '';

            effects.set([name, theme].filter(Boolean).join('.'), style);
            effects.set([file, theme].filter(Boolean).join('.'), style);
          });
      });

    components = Array.from(imports.keys()).filter(key => !(/^v/i.test(key)));
  },
  directives : () => {
    const root = resolve('src/directives');

    glob.sync('*', { cwd: root })
      .filter(p => !matchWIP(`${ root }/${ p }`))
      .forEach(p => {
        const shortname = basename(p);
        const name = camelize(`v-${ shortname }`);
        const file = `${ pkgName }/${ relative(pkgDir, `${ root }/${ p }`) }`;

        imports.set(name, file);

        const cwd = resolve(isDev ? `src/directives/${ p }` : `dist/style/v-${ p }`);
        const pattern = isDev ? `${ shortname }*.scss` : `${ shortname }*.css`;
        const ignore = ['*.vars.scss', '*.min.css'];

        glob.sync(pattern, { cwd, ignore })
          .forEach(p => {
            const style = `${ pkgName }/${ relative(pkgDir, `${ cwd }/${ p }`) }`;
            const parts = p.split('.');
            const theme = parts.length > 2 ? parts[parts.length - 2] : '';

            effects.set([name, theme].filter(Boolean).join('.'), style);
            effects.set([file, theme].filter(Boolean).join('.'), style);
          });
      });

    directives = Array.from(imports.keys()).filter(key => /^v/i.test(key));
  },
  styles : () => {
    const root = resolve(isDev ? 'src/style' : 'dist/style');
    const name = `line.bundle.${ isDev ? 'scss' : 'css' }`;

    effects.set(
      'bundle',
      `${ pkgName }/${ relative(pkgDir, `${ root }/${ name }`) }`,
    );

    const pattern = isDev ? 'line*.scss' : 'line*.css';
    const ignore = ['line.bundle.scss', 'line.bundle.css', '*.min.css'];

    glob.sync(pattern, { cwd: root, ignore })
      .forEach(p => {
        effects.set(
          basename(p),
          `${ pkgName }/${ relative(pkgDir, `${ root }/${ p }`) }`,
        );
      });
  },
};

// initial lookup
lookup.components();
lookup.directives();
lookup.styles();

if (isDev) {
  fs.watch(
    resolve('src/components'),
    { recursive: true },
    debounce(
      (event) => {
        if (event !== 'rename') return;
        console.log('watch components', event);
        lookup.components();
      },
    ),
  );

  fs.watch(
    resolve('src/directives'),
    { recursive: true },
    debounce(
      (event) => {
        if (event !== 'rename') return;
        console.log('watch directives', event);
        lookup.directives();
      },
    ),
  );
}

module.exports = {
  name   : pkgName,
  prefix : 'line',

  isDev,

  imports,
  effects,

  get components() {
    return components;
  },
  get directives() {
    return directives;
  },
};
