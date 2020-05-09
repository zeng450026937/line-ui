const fs = require('fs');
const path = require('path');
const glob = require('glob');
const pkg = require('./package.json');

const pkgName = pkg.name;
const pkgDir = path.resolve(__dirname, '.');
const resolve = (p) => path.resolve(pkgDir, p);
const relative = (from, to) => path.relative(from, to).split('\\').join('/');
const basename = (p) => path.basename(p, path.extname(p));

const { matchWIP, camelize, hyphenate, debounce } = require('./scripts/utils');

const isDev = `${process.env.LINE_DEV}` === 'true';

const imports = new Map();
const effects = new Map();
const dependencies = new Map();
const nameToFile = new Map();
let components = [];
let directives = [];

const themes = ['ios', 'md', ''];

const collect = (issuer, component) => {
  const components = dependencies.get(issuer) || [];
  components.push(component);
  dependencies.set(issuer, components);
};

const lookup = {
  components: () => {
    const root = resolve('src/components');

    glob
      .sync('*/*.tsx', { cwd: root })
      .filter((p) => !matchWIP(`${root}/${p}`))
      .forEach((p) => {
        const shortname = basename(p);
        const name = camelize(`-${shortname}`);
        const file = `${pkgName}/${relative(
          pkgDir,
          `${root}/${p.replace('.tsx', '')}`
        )}`;

        imports.set(name, file);

        const dir = path.dirname(p);
        const cwd = resolve(
          isDev ? `src/components/${dir}` : `dist/style/${dir}`
        );
        const pattern = isDev ? `${shortname}*.scss` : `${shortname}*.css`;
        const ignore = ['*.vars.scss', '*.min.css'];

        glob.sync(pattern, { cwd, ignore }).forEach((p) => {
          const style = `${pkgName}/${relative(pkgDir, `${cwd}/${p}`)}`;
          const parts = p.split('.');
          const theme = parts.length > 2 ? parts[parts.length - 2] : '';

          effects.set([name, theme].filter(Boolean).join('.'), style);
          effects.set([file, theme].filter(Boolean).join('.'), style);

          nameToFile.set(
            [name, theme].filter(Boolean).join('.'),
            [file, theme].filter(Boolean).join('.')
          );
        });

        nameToFile.set(name, file);

        collect(`${pkgName}/src/components/${dir}`, name);
      });

    components = Array.from(imports.keys()).filter((key) => !/^v/i.test(key));
  },
  directives: () => {
    const root = resolve('src/directives');

    glob
      .sync('*', { cwd: root })
      .filter((p) => !matchWIP(`${root}/${p}`))
      .forEach((p) => {
        const shortname = basename(p);
        const name = camelize(`v-${shortname}`);
        const file = `${pkgName}/${relative(pkgDir, `${root}/${p}`)}`;

        imports.set(name, file);

        const cwd = resolve(
          isDev ? `src/directives/${p}` : `dist/style/v-${p}`
        );
        const pattern = isDev ? `${shortname}*.scss` : `${shortname}*.css`;
        const ignore = ['*.vars.scss', '*.min.css'];

        glob.sync(pattern, { cwd, ignore }).forEach((p) => {
          const style = `${pkgName}/${relative(pkgDir, `${cwd}/${p}`)}`;
          const parts = p.split('.');
          const theme = parts.length > 2 ? parts[parts.length - 2] : '';

          effects.set([name, theme].filter(Boolean).join('.'), style);
          effects.set([file, theme].filter(Boolean).join('.'), style);

          nameToFile.set(
            [name, theme].filter(Boolean).join('.'),
            [file, theme].filter(Boolean).join('.')
          );
        });

        nameToFile.set(name, file);
      });

    directives = Array.from(imports.keys()).filter((key) => /^v/i.test(key));
  },
  styles: () => {
    const root = resolve(isDev ? 'src/style' : 'dist/style');
    const name = `line.bundle.${isDev ? 'scss' : 'css'}`;

    effects.set('bundle', `${pkgName}/${relative(pkgDir, `${root}/${name}`)}`);

    const pattern = isDev ? 'line*.scss' : 'line*.css';
    const ignore = ['line.bundle.scss', 'line.bundle.css', '*.min.css'];

    glob.sync(pattern, { cwd: root, ignore }).forEach((p) => {
      effects.set(
        basename(p),
        `${pkgName}/${relative(pkgDir, `${root}/${p}`)}`
      );
    });
  },
  controllers: () => {
    const issuer = `${pkgName}/src/controllers`;
    // find a way to detect controller list dynamiclly
    const components = [
      'ActionSheet',
      'Alert',
      'Loading',
      'Picker',
      'Popover',
      'Popup',
      'Toast',
      'Tooltip',
    ];
    components.forEach((component) => {
      const name = `${component}Controller`;
      themes.forEach((theme) => {
        const style = effects.get([component, theme].filter(Boolean).join('.'));
        if (style) {
          effects.set([name, theme].filter(Boolean).join('.'), style);
        }
      });
      collect(issuer, component);
      collect(name, component);
    });
  },
  dependencies: () => {
    const issuers = {
      ActionSheet: ['Overlay'],
      Alert: ['Overlay'],
      Loading: ['Overlay', 'Spinner'],
      Picker: ['Overlay', 'PickerColumn'],
      Popover: ['Overlay'],
      Popup: ['Overlay'],
      Toast: ['Icon'],
      Tooltip: ['Overlay'],
      // ---- //
      Button: ['vRipple'],
      CheckBox: ['vRipple', 'CheckIndicator'],
      Chip: ['vRipple'],
      CollapseItem: ['Icon'],
      ComboBox: ['ComboBoxItem'],
      Datetime: ['PickerController'],
      DropdownMenu: ['Overlay', 'PickerColumn'],
      Fab: ['FabGroup'],
      FabButton: ['vRipple'],
      Icon: ['FontIcon', 'SvgIcon'],
      InfiniteScrollContent: ['Spinner'],
      Item: ['vRipple'],
      PageIndicator: ['Icon'],
      Radio: ['vRipple'],
      RefresherContent: ['Spinner', 'Icon'],
      Stepper: ['Icon'],
      TabButton: ['vRipple'],
    };
    Object.keys(issuers).forEach((issuer) => {
      const path = `src/components/${hyphenate(issuer)}/`.toLowerCase();
      if (matchWIP(path)) return;
      const file = nameToFile.get(issuer);
      const components = issuers[issuer];
      components.forEach((component) => {
        collect(issuer, component);
        collect(file, component);
      });
    });
  },
};

// initial lookup
lookup.components();
lookup.directives();
lookup.styles();
lookup.controllers();
lookup.dependencies();

const dedupe = (val) => Array.from(new Set(val));
const dependence = (issuer, theme) => {
  const seen = [];
  const components = dependencies.get(issuer);
  if (components) {
    components.forEach((c) => {
      const effect =
        effects.get([c, theme].filter(Boolean).join('.')) || effects.get(c);
      seen.push(effect);
      seen.push(...dependence(c, theme));
    });
  }
  const effect =
    effects.get([issuer, theme].filter(Boolean).join('.')) ||
    effects.get(issuer);
  seen.push(effect);
  seen.push(effects.get('bundle'));
  return dedupe(seen.filter(Boolean));
};

if (isDev) {
  fs.watch(
    resolve('src/components'),
    { recursive: true },
    debounce((event) => {
      if (event !== 'rename') return;
      console.log('[@line-ui/line] watch components', event);
      lookup.components();
    })
  );

  fs.watch(
    resolve('src/directives'),
    { recursive: true },
    debounce((event) => {
      if (event !== 'rename') return;
      console.log('[@line-ui/line] watch directives', event);
      lookup.directives();
    })
  );
}

module.exports = {
  name: pkgName,
  prefix: 'line',

  isDev,

  imports,
  effects,

  dedupe,
  dependence,

  get components() {
    return components;
  },
  get directives() {
    return directives;
  },
};
