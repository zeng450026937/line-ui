/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

// folder contains electron setup
const SETUP_DIR = 'out/setup';
// folder contains dist file for electron(main & renderer)
const OUTPUT_DIR = 'out/dist';
// entry file for electron
const ENTRY_FILE = 'browser.js';
// install file
const INSTALLER_DIR = 'out/installer';

module.exports = (api, options) => {
  api.registerCommand(
    'build:installer',
    {
      description: 'build app with electron-wininstaller',
      usage: 'vue-cli-service packager [electron-wininstaller options]',
      details: 'TBD',
    },
    (args, rawArgs) => {
      const electronInstaller = require('electron-winstaller');
      const { done } = require(api.resolve(
        './node_modules/@vue/cli-shared-utils'
      ));

      electronInstaller
        .createWindowsInstaller({
          appDirectory: 'out/setup/vcd-win32-x64',
          outputDirectory: 'out/installer',
          authors: 'Team 7',
        })
        .then(() => {
          done('build installer complete.');
        });
    }
  );

  api.registerCommand(
    'pack:electron',
    {
      description: 'build app with electron-packager',
      usage: 'vue-cli-service packager [electron-packager options]',
      details: 'TBD',
    },
    (args, rawArgs) => packageInstaller(args, rawArgs, api, options)
  );

  api.registerCommand(
    'build:electron',
    {
      description: 'build app with electron-builder',
      usage: 'vue-cli-service build:electron [electron-builder options]',
      details: 'TBD',
    },
    async (args, rawArgs) => {
      const fs = require('fs');
      const { remove } = require(api.resolve('./node_modules/fs-extra'));
      const { inspect, promisify } = require('util');
      const {
        execa,
        chalk,
        log,
        info,
        warn,
        error,
        done,
      } = require(api.resolve('./node_modules/@vue/cli-shared-utils'));
      const formatStats = require(api.resolve(
        './node_modules/@vue/cli-service/lib/commands/build/formatStats'
      ));
      const webpack = require(api.resolve('./node_modules/webpack'));
      const builder = require('electron-builder');

      const mode = module.exports.defaultModes['build:electron'];
      const opts = {
        setupDir: SETUP_DIR,
        outputDir: OUTPUT_DIR,
        entryFile: ENTRY_FILE,
      };

      args.clean = true;
      args.dest = api.resolve(opts.outputDir);

      // temporary change baseUrl
      const { publicPath: originPublicPath } = options;

      options.publicPath = '';

      // webpack config for renderer process
      chainRendererWebpack(api, mode);

      // webpack config for main process
      const config = genMainWebpack(api, mode, opts);

      // config for builder
      const builderConfig = genBuilderConfig(api, opts);

      if (args.clean) {
        await remove(api.resolve(opts.setupDir));
      }

      return api.service
        .run('build', args)
        .then(() =>
          promisify(webpack)(config.toConfig()).then((stats) => {
            log(formatStats(stats, api.resolve(opts.outputDir), api));
            done(
              `Build complete. The ${chalk.cyan(
                opts.outputDir
              )} directory is ready to be packed.`
            );
            log();
            // restore publicPath
            options.publicPath = originPublicPath;
          })
        )
        .then(() => {
          if (args.nopack) return Promise.resolve();

          const { writeJson } = require(api.resolve('./node_modules/fs-extra'));
          const pacakgeInfo = require(api.resolve('package.json'));

          delProperty(pacakgeInfo, [
            'scripts',
            'vuePlugins',
            'dependencies',
            'devDependencies',
          ]);

          return writeJson(
            api.resolve(`${OUTPUT_DIR}/package.json`),
            pacakgeInfo,
            { spaces: 2 }
          ).then(() =>
            builder
              .build({
                config: builderConfig,
                ia32: !!args.ia32,
                x64: !!args.x64,
                dir: !!args.dir,
              })
              .then(() => {
                done('Packing completed.');
              })
          );
        });
    }
  );
  api.registerCommand(
    'serve:electron',
    {
      description: 'serve app and launch electron',
      usage: 'vue-cli-service serve:electron',
      details: 'TBD',
    },
    (args, rawArgs) => {
      const { inspect, promisify } = require('util');
      const {
        execa,
        chalk,
        log,
        info,
        warn,
        error,
        done,
      } = require(api.resolve('./node_modules/@vue/cli-shared-utils'));
      const webpack = require(api.resolve('./node_modules/webpack'));

      const mode = args.mode || module.exports.defaultModes['serve:electron'];
      const opts = {
        outputDir: OUTPUT_DIR,
        entryFile: ENTRY_FILE,
      };

      const instCount = args.multi === true ? 2 : args.multi || 1;

      // webpack config for renderer process
      chainRendererWebpack(api, mode);

      // webpack config for main process
      const config = genMainWebpack(api, mode, opts);

      return Promise.all([api.service.run('serve', args), startHMRServer(api)])
        .then(([server, hmrServer]) => {
          info('Starting development electron...');

          const path = require('path');
          const { entryFile } = opts;

          config.plugin('env').use(webpack.EnvironmentPlugin, [
            {
              WEBPACK_DEV_SERVER_URL: server.url,
              WEBPACK_HMR_SOCKET_PATH: hmrServer.socketPath,
            },
          ]);

          config
            .entry(entryFile.substring(0, entryFile.length - 3))
            .add(path.resolve(__dirname, 'main-hmr.js'));

          return new Promise((resolve, reject) => {
            let handleResolve = resolve;
            let handleReject = reject;

            const compiler = webpack(config.toConfig());

            compiler.hooks.compile.tap('electron-webpack-dev-runner', () => {
              hmrServer.beforeCompile();
              info('Compiling main process...');
            });

            const watcher = compiler.watch({}, (e, stats) => {
              logError(e);
              logStats(stats);

              if (e) {
                if (handleReject) {
                  handleReject(e);
                  handleReject = null;
                }
                error(e);

                return;
              }

              if (handleResolve) {
                handleResolve(hmrServer);
                handleResolve = null;
              }

              hmrServer.built(stats);
            });

            require('async-exit-hook')((callback) => {
              watcher.close(() => callback());
            });

            function logError(e) {
              if (e) {
                console.error(e);
                if (e.details) {
                  console.error(e.details);
                }
              }
            }

            function logStats(stats) {
              if (stats.hasErrors()) {
                console.error(info.errors);
              }

              if (stats.hasWarnings()) {
                console.warn(info.warnings);
              }
            }
          });
        })
        .then((hmrServer) => {
          const electrons = [];
          const queuedData = [];
          let count = 0;
          let lastLogIndex = null;

          function startElectron(index = 0) {
            const electron = execa(
              require(api.resolve('./node_modules/electron')),
              // Have it load the main process file built with webpack
              [api.resolve(`./${opts.outputDir}/${opts.entryFile}`)],
              {
                detached: true,
                cwd: api.getCwd(),
                env: {
                  ...process.env,
                  // Disable electron security warnings
                  ELECTRON_DISABLE_SECURITY_WARNINGS: true,
                  WEBPACK_HMR_SOCKET_PATH: hmrServer.socketPath,
                },
              }
            );

            electron.on('close', (exitCode) => {
              if (exitCode === 100) {
                electron.stdout.removeAllListeners();
                electron.removeAllListeners();
                setImmediate(() => startElectron(index));
              } else {
                electrons.splice(index, 1);

                if (!electrons.length) {
                  queuedData.length = 0;
                  process.emit('message', 'shutdown');
                }
              }
            });

            electron.stdout.on('data', (data) => {
              data = data.toString().trim();

              if (data === '') return;

              if (data === '[HMR] Updated modules:') {
                queuedData[index] = data;

                return;
              }

              if (queuedData[index] != null) {
                data = queuedData[index] + data;
                queuedData[index] = null;
              }

              if (lastLogIndex === null || lastLogIndex !== index) {
                lastLogIndex = index;
                info(`Electron ${index === 0 ? '' : index}:`);
              }
              log(`- ${data.startsWith('[HMR]') ? chalk.cyan(data) : data}`);
            });

            electrons[index] = electron;

            return electron;
          }

          while (count < instCount) {
            startElectron(count);
            count++;
          }

          require('async-exit-hook')((callback) => {
            hmrServer.close(callback);
          });
        });
    }
  );
};

module.exports.defaultModes = {
  'pack:electron': 'production',
  'build:electron': 'production',
  'serve:electron': 'development',
};

function chainRendererWebpack(api, mode = 'production') {
  const s = JSON.stringify;

  api.chainWebpack((config) => {
    config.target('electron-renderer');
    config.node.clear().merge({
      console: false,
      global: true,
      process: false,
      __filename: false,
      __dirname: false,
      Buffer: false,
      setImmediate: false,
      dgram: false,
      fs: false,
      net: false,
      tls: false,
      /* eslint-disable-next-line @typescript-eslint/camelcase */
      child_process: false,
    });
    config.plugin('define').tap((opts) => {
      opts[0].__DARWIN__ = process.platform === 'darwin';
      opts[0].__WIN32__ = process.platform === 'win32';
      opts[0].__LINUX__ = process.platform === 'linux';

      if (mode === 'production') {
        opts[0]['process.env'].BASE_URL = '__dirname + "/"';
        opts[0].__public = '__dirname';
        opts[0].__static =
          'require("path").resolve(process.resourcesPath, "static")';
      } else {
        opts[0].__public = s(api.resolve('./public'));
        opts[0].__static = s(api.resolve('./static'));
      }

      opts[0] = flatten(opts[0]);

      return opts;
    });
  });
}

function genMainWebpack(api, mode = 'production', opts = {}) {
  const { outputDir = 'electron', entryFile = ENTRY_FILE } = opts;
  const config = api.resolveChainableWebpackConfig();

  config.entryPoints.clear();
  config.module.rules.clear();
  config.node.clear().merge({
    console: false,
    global: false,
    process: false,
    __filename: false,
    __dirname: false,
    Buffer: false,
    setImmediate: false,
    dgram: false,
    fs: false,
    net: false,
    tls: false,
    /* eslint-disable-next-line @typescript-eslint/camelcase */
    child_process: false,
  });
  config.target('electron-main');
  config
    .entry(entryFile.substring(0, entryFile.length - 3))
    .add(api.resolve(`./src/${entryFile}`));
  config.plugins.values().forEach((plugin) => {
    switch (plugin.name) {
      case 'define':
      case 'case-sensitive-paths':
      case 'friendly-errors':
      // development
      /* eslint-disable-next-line no-fallthrough */
      case 'hmr':
      case 'no-emit-on-errors':
      case 'progress':
      // production
      /* eslint-disable-next-line no-fallthrough */
      case 'hash-module-ids':
      case 'named-chunks':
        break;
      default:
        config.plugins.delete(plugin.name);
        break;
    }
  });
  config.optimization.splitChunks({
    cacheGroups: {
      vendors: {
        name: 'chunk-vendors',
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        // webpack bug: minChunks: 1 might cause module load error when only one chunk is used.
        minChunks: 2,
        chunks: 'initial',
      },
      common: {
        name: 'chunk-common',
        minChunks: 2,
        priority: -20,
        chunks: 'initial',
        reuseExistingChunk: true,
      },
    },
  });
  config.output
    .path(api.resolve(outputDir))
    .filename('[name].js')
    .chunkFilename('[name].js')
    .publicPath('');

  return config;
}

function genBuilderConfig(api, opts) {
  const fs = require('fs');
  const { execa, chalk, log, info, warn, error, done } = require(api.resolve(
    './node_modules/@vue/cli-shared-utils'
  ));

  const builderConfig = {
    directories: {
      output: api.resolve(opts.setupDir),
      app: api.resolve(opts.outputDir),
    },
    files: [
      {
        from: api.getCwd(),
        filter: ['package.json'],
      },
      {
        from: api.resolve(opts.outputDir),
      },
    ],
    extraResources: [
      {
        from: api.resolve('./static'),
        to: 'static',
      },
    ],
    extraMetadata: { main: opts.entryFile },
    extends: null,
  };

  // const configPath = api.resolve('./electron-builder.json');
  // let userBuilderConfig;

  // if (fs.existsSync(configPath)) {
  //   try {
  //     userBuilderConfig = require(configPath);
  //     if (!userBuilderConfig || typeof userBuilderConfig !== 'object') {
  //       error(
  //         `Error loading ${chalk.bold('electron-builder.json')}: should export an object.`
  //       );
  //       userBuilderConfig = null;
  //     }
  //   }
  //   catch (e) {
  //     error(`Error loading ${chalk.bold('electron-builder.json')}:`);
  //     error(e);
  //   }
  // }

  // Object.assign(builderConfig, userBuilderConfig);

  return builderConfig;
}

function getPackagerConfig(api) {
  return {
    platform: 'win32',
    // arch: toPackageArch(process.env.TARGET_ARCH),
    asar: true, // TODO: Probably wanna enable this down the road.
    out: SETUP_DIR,
    icon: api.resolve('public/favicon.png'),
    dir: OUTPUT_DIR,
    overwrite: true,
    tmpdir: false,
    derefSymlinks: false,
    prune: false, // We'll prune them ourselves below.
    ignore: [
      new RegExp('/node_modules/electron($|/)'),
      new RegExp('/node_modules/electron-packager($|/)'),
      new RegExp('/node_modules/electron-builder($|/)'),
      new RegExp('/\\.git($|/)'),
      new RegExp('/node_modules/\\.bin($|/)'),
    ],
    appCopyright: 'Copyright © 2019 Yealink, Inc.',

    // macOS
    /*
    appBundleId     : '1.0.1',
    appCategoryType : 'public.app-category.developer-tools',
    osxSign         : true,
    protocols       : [
      {
        name    : getBundleID(),
        schemes : [
          isPublishableBuild
            ? 'x-github-desktop-auth'
            : 'x-github-desktop-dev-auth',
          'x-github-client',
          'github-mac',
        ],
      },
    ],
    extendInfo    : `${projectRoot}/script/info.plist`,
    */

    // Windows
    win32metadata: {
      CompanyName: 'Yealink',
      FileDescription: 'Yealink VC Desktop',
      OriginalFilename: '',
      ProductName: 'Yealink VC Desktop',
      InternalName: 'Yealink',
    },
  };
}

const build = async (args, rawArgs, api, options) => {
  const { remove } = require(api.resolve('./node_modules/fs-extra'));
  const { inspect, promisify } = require('util');
  const { execa, chalk, log, info, warn, error, done } = require(api.resolve(
    './node_modules/@vue/cli-shared-utils'
  ));
  const formatStats = require(api.resolve(
    './node_modules/@vue/cli-service/lib/commands/build/formatStats'
  ));
  const webpack = require(api.resolve('./node_modules/webpack'));
  const mode = module.exports.defaultModes['pack:electron'];
  const opts = {
    setupDir: SETUP_DIR,
    outputDir: OUTPUT_DIR,
    entryFile: ENTRY_FILE,
  };

  args.clean = true;
  args.dest = api.resolve(opts.outputDir);
  // temporary change baseUrl
  const { publicPath: originPublicPath } = options;

  options.publicPath = '';
  // webpack config for renderer process
  chainRendererWebpack(api, mode);
  // webpack config for main process
  const config = genMainWebpack(api, mode, opts);
  // config for builder

  if (args.clean) {
    await remove(api.resolve(opts.setupDir));
  }

  return api.service.run('build', args).then(() =>
    promisify(webpack)(config.toConfig()).then((stats) => {
      log(formatStats(stats, api.resolve(opts.outputDir), api));
      done(
        `Build complete. The ${chalk.cyan(
          opts.outputDir
        )} directory is ready to be packed.`
      );
      log();
      // restore publicPath
      options.publicPath = originPublicPath;
    })
  );
};

const packageInstaller = async (args, rawArgs, api, options) => {
  const { chalk, log, done, info } = require(api.resolve(
    './node_modules/@vue/cli-shared-utils'
  ));

  await build(args, rawArgs, api, options);

  if (args.nopack) return Promise.resolve();

  const { writeJson } = require(api.resolve('./node_modules/fs-extra'));
  const pacakgeInfo = require(api.resolve('package.json'));

  // process pacakgeInfo name
  // whitespace & '-'
  pacakgeInfo.main = `./${ENTRY_FILE}`;
  pacakgeInfo.name = pacakgeInfo.name.replace(/-/g, '');

  delProperty(pacakgeInfo, ['scripts', 'vuePlugins', 'devDependencies']);

  await writeJson(api.resolve(`${OUTPUT_DIR}/package.json`), pacakgeInfo, {
    spaces: 2,
  });

  done(
    `Writen package.json into ${chalk.cyan(
      api.resolve(`${OUTPUT_DIR}/package.json`)
    )}.`
  );
  log();

  const packager = require('electron-packager');
  const packagerConfig = getPackagerConfig(api);
  let packagerPath = await packager(packagerConfig);

  log();
  done(
    `Packaging complete. The ${chalk.cyan(
      packagerPath
    )} directory is ready to be build installer.`
  );

  packagerPath = `${packagerPath}`;

  info('Building installer.');
  log();

  const electronInstaller = require('electron-winstaller');

  return electronInstaller
    .createWindowsInstaller({
      appDirectory: packagerPath,
      // remoteReleases:`http://10.200.112.103:5014/update/win32/${pacakgeInfo.lastVersion}`,
      iconUrl: api.resolve('public/favicon.png'),
      outputDirectory: INSTALLER_DIR,
      // loadingGif:'public/win32-installer-splash.gif',
      noMsi: true,
      noDelta: true,
    })
    .then(() => {
      done('Build installer completed.');
    });
};

function delProperty(obj, propertys) {
  propertys.forEach((prop) => {
    delete obj[prop];
  });
}

function isPlainObj(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function flatten(obj, prefix = [], separator = '.') {
  return Object.entries(obj).reduce(
    (acc, [key, value]) =>
      Object.assign(
        acc,
        isPlainObj(value)
          ? flatten(value, prefix.concat(key))
          : { [prefix.concat(key).join(separator)]: value }
      ),
    {}
  );
}

const HMRServer = require('./hmr-server');

let hmrServer = null;

async function startHMRServer(api) {
  if (!hmrServer) {
    hmrServer = new HMRServer();
  }
  const { chalk, log, done, info, warn, error } = require(api.resolve(
    './node_modules/@vue/cli-shared-utils'
  ));

  await hmrServer.listen();

  hmrServer.ipc.on('close', () => {
    done('HMR server closed');
  });
  hmrServer.ipc.on('error', (e) => {
    warn(e);
  });

  return hmrServer;
}
