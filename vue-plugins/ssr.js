// TODO
// support & test for SSR build
module.exports = (api, options) => {
  api.registerCommand(
    'ssr',
    {
      description: 'start SSR development server',
      usage: 'vue-cli-service SSR [options]',
      options: {
        '--dev': 'compile line-ui from source',
        // any other options supported in 'server' command
      },
    },
    async (args, rawArgs) => {
      const fs = require('fs-extra');
      const LRU = require('lru-cache');
      const { createBundleRenderer } = require('vue-server-renderer');
      const { log, warn, error } = require('@vue/cli-shared-utils');
      const chalk = require('chalk');
      const { outputDir } = options;
      const { dev = false } = args;

      if (options.pages) {
        warn('SSR for multi-pages is not supported.');
      }

      log(`${chalk.bold(chalk.bgBlue(' SSR '))}${chalk.bgGray(' PREPARE ')}`);
      log('Preparing SSR...', `${chalk.green('☕️')}`);

      let bundle;
      let manifest;
      let renderer;

      const template = await fs.readFile(
        api.resolve('public/ssr.index.html'),
        'utf-8'
      );

      const createRenderer = () => {
        renderer = createBundleRenderer(bundle, {
          // component caching
          cache: new LRU({
            max: 1000,
            maxAge: 1000 * 60 * 15,
          }),
          template,
          clientManifest: manifest,
          runInNewContext: false,
        });
      };

      const readFile = (fs, file) => {
        return fs.readFileSync(api.resolve(`${outputDir}/${file}`), 'utf-8');
      };

      const ssrServer = async () => {
        const config = api.resolveChainableWebpackConfig();

        config.entry('app').clear().add(api.resolve('src/app.ssr.ts'));

        config.target('node');

        config.output.libraryTarget('commonjs2');

        // https://webpack.js.org/configuration/externals/#externals
        // https://github.com/liady/webpack-node-externals
        config.externals(
          require('webpack-node-externals')({
            whitelist: [
              /\.css$/,
              dev ? /^@line-ui\/line/ : '',
              dev ? /^swiper/ : '',
              dev ? /^dom7/ : '',
              dev ? /^ssr-window/ : '',
              dev ? /^@popperjs/ : '',
            ].filter(Boolean),
          })
        );

        // remove html plugins
        // config.plugins.values().forEach((plugin) => {
        //   switch (true) {
        //     case /html/.test(plugin.name):
        //     case /move-index/.test(plugin.name):
        //     case /preload/.test(plugin.name):
        //     case /prefetch/.test(plugin.name):
        //     case /cors/.test(plugin.name):
        //     case /copy/.test(plugin.name):
        //       config.plugins.delete(plugin.name);
        //       break;
        //     default:
        //       break;
        //   }
        // });

        // disable any of the default cache groups
        config.optimization.splitChunks({
          cacheGroups: {
            default: false,
          },
        });
        config.optimization.runtimeChunk = false;

        // gen `vue-ssr-client-manifest.json`
        config
          .plugin('vue-ssr-server')
          .use(require('vue-server-renderer/server-plugin'));

        await new Promise((resolve, reject) => {
          log(`${chalk.bold(chalk.bgBlue(' SSR '))}${chalk.bgGray(' BUILD ')}`);
          log('Starting SSR...', `${chalk.green('🚀')}`);

          let handleResolve = resolve;
          let handleReject = reject;

          const MFS = require('memory-fs');
          const webpack = require('webpack');

          const compiler = webpack(config.toConfig());
          const mfs = new MFS();

          compiler.outputFileSystem = mfs;

          const watcher = compiler.watch({}, (e, stats) => {
            logError(e);
            logStats(stats);

            if (e) {
              error(e);
              if (handleReject) {
                handleReject();
                handleReject = null;
                handleResolve = null;
              }
              return;
            }

            bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'));

            createRenderer();

            if (handleResolve) {
              handleResolve();
              handleResolve = null;
              handleReject = null;
            }
          });

          require('async-exit-hook')((callback) => {
            watcher.close(() => callback());
          });

          const logError = (e) => {
            if (e) {
              error(e);
              if (e.details) {
                error(e.details);
              }
            }
          };

          const logStats = (stats) => {
            const info = stats.toJson();

            if (stats.hasErrors()) {
              error(info.errors);
            }

            if (stats.hasWarnings()) {
              warn(info.warnings);
            }
          };
        });
      };

      const ssrClient = async () => {
        api.chainWebpack((config) => {
          config.entry('app').clear().add(api.resolve('src/app.ts'));

          config
            .plugin('vue-ssr-server')
            .use(require('vue-server-renderer/client-plugin'));
        });

        api.configureDevServer((app, server) => {
          app.get('*', ssrMiddleware);
          server.compiler.hooks.done.tap('ssr-hack', ({ compilation }) => {
            if (compilation.errors.length) return;

            manifest = JSON.parse(
              readFile(
                server.compiler.outputFileSystem,
                'vue-ssr-client-manifest.json'
              )
            );

            createRenderer();
          });
        });

        await api.service.run('serve', args, rawArgs);
      };

      const serverinfo =
        `express/${require('express/package.json').version} ` +
        `vue-server-renderer/${
          require('vue-server-renderer/package.json').version
        }`;

      const ssrMiddleware = (req, res, next) => {
        const now = Date.now();

        const context = {
          url: req.url,
        };

        const handleError = (err) => {
          // not found
          // invoke next middleware(devServer)
          if (err.code === 404) {
            next();
            return;
          }
          // redirect
          if (err.url) {
            res.redirect(err.url);
            return;
          }
          // error page
          res.status(500).send(`
            <div>500 | Internal Server Error</div>
            <div>error during render: ${req.url}</div>
            <pre>${err.stack}</pre>
          `);
          error(`error during render: ${req.url}`);
          error(err.stack);
        };

        renderer.renderToString(context, (err, html) => {
          if (err) {
            handleError(err);
            return;
          }

          res.setHeader('Content-Type', 'text/html');
          res.setHeader('Server', serverinfo);

          res.send(html);

          log(`${Date.now() - now}ms - ${req.url}`, `${chalk.green('⚡️')}`);
        });
      };

      if (dev) {
        api.chainWebpack((config) => {
          config.resolve.alias.set(
            '@line-ui/line',
            api.resolve('packages/line')
          );
        });
      }

      await Promise.all([
        // ssrServer must be call before ssrClient,
        // as ssrClient chainWebpack will inject something unwanted in server side
        ssrServer(),
        ssrClient(),
      ]);

      log(`${chalk.bold(chalk.bgBlue(' SSR '))}${chalk.bgGray(' DONE ')}`);
      log(
        `Running SSR with LINE-UI ${
          require('@line-ui/line/package.json').version
        }`,
        `${chalk.green('🍺')}`
      );
    }
  );
};
