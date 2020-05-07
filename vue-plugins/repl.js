module.exports = (api, options) => {
  api.registerCommand(
    'repl',
    {
      description: 'serve repl',
      usage: 'vue-cli-service repl',
      details: 'TBD',
    },
    (args, rawArgs) => {
      process.env.TARGET = 'repl';
      process.env.LINE_DEV = true;

      options['line-ui'] = { autoimport: false };

      api.chainWebpack((config) => {
        config.externals({
          vue: 'Vue',
          '@line-ui/line': 'Line',
        });

        if (process.env.NODE_ENV === 'development') {
          const outputDir = api.resolve(options.outputDir);
          const tapCopy = () => {
            config.plugin('copy').tap((options) => {
              return [
                [
                  ...options[0],
                  {
                    from: `packages/line/dist`,
                    to: `${outputDir}/line/dist`,
                    toType: 'dir',
                  },
                ],
              ];
            });
          };
          tapCopy();
        }
      });

      const { build } = args;
      const command = build ? 'build' : 'serve';
      api.service.run(command, args, rawArgs);
    }
  );
};

module.exports.defaultModes = {
  repl: 'development',
};
