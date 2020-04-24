const Crocket = require('crocket');
const { app } = require('electron');
const logApplyResult = require('webpack/hot/log-apply-result');

module.exports = class HMRClient {
  constructor() {
    this.ipc = new Crocket();
    this.hot = module.hot;
    this.lastHash = null;
    this.socketPath = process.env.WEBPACK_HMR_SOCKET_PATH;

    process.on('message', () => {
      console.log('hello parent');
    });

    this.ipc.connect(
      {
        path: this.socketPath,
      },
      (error) => {
        if (error) {
          console.error(error.stack || error.toString());
        }
      }
    );

    this.ipc.on('error', (error) => {
      console.error(error.stack || error.toString());
    });

    this.ipc.on('close', () => {
      console.log('Close app');
      app.exit();
    });

    this.ipc.on('/built', (data) => {
      this.lastHash = data.hash;
      if (this.isUpToDate()) return;

      const status = this.hot.status();

      if (status === 'idle') {
        this.check();
      } else if (status === 'abort' || status === 'fail') {
        console.warn(
          `[HMR] Cannot apply update as a previous update ${status}ed. Need to do a full reload!`
        );
      } else {
        console.warn(`[HMR] Cannot check changes, status ${status}`);
      }
    });
  }

  isUpToDate() {
    /* eslint-disable-next-line no-undef, @typescript-eslint/camelcase */
    return this.lastHash === __webpack_hash__;
  }

  check() {
    this.hot
      .check(true)
      .then((outdatedModules) => {
        if (outdatedModules == null) {
          console.warn('[HMR] Cannot find update. Need to do a full reload!');
          console.warn(
            '[HMR] (Probably because of restarting the webpack-dev-server)'
          );

          return;
        }

        logApplyResult(outdatedModules, outdatedModules);

        if (this.isUpToDate()) {
          console.log('[HMR] App is up to date.');
        }
      })
      .catch((error) => {
        const status = this.hot.status();

        if (status === 'abort' || status === 'fail') {
          console.warn(`[HMR] ${error.stack || error.toString()}`);
          console.warn(
            '[HMR] Cannot apply update. Need to do a full reload - application will be restarted'
          );
        } else {
          console.warn(`[HMR] Update failed: ${error.stack || error.message}`);
        }

        app.exit(100);
      });
  }
};
