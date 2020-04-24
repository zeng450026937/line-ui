const Crocket = require('crocket');

module.exports = class HMRServer {
  constructor() {
    this.ipc = new Crocket();
    this.state = false;
    this.socketPath = null;
  }

  listen() {
    return new Promise((resolve, reject) => {
      const socketPath = `/tmp/electron-main-ipc-${process.pid.toString(
        16
      )}.sock`;

      this.ipc.listen({ path: socketPath }, (error) => {
        if (error != null) {
          reject(error);
        }
        this.socketPath = socketPath;
        resolve(socketPath);
      });
    });
  }

  close(callback) {
    this.ipc.close(callback);
  }

  beforeCompile() {
    this.state = false;
  }

  built(stats) {
    this.state = true;
    setImmediate(() => {
      if (!this.state) {
        return;
      }

      const { hash } = stats.toJson({
        assets: false,
        chunks: false,
        children: false,
        modules: false,
      });

      this.ipc.emit('/built', { hash });
    });
  }
};
