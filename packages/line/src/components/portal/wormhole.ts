import Vue from 'vue';

const Wormhole = Vue.extend({
  data() {
    return {
      holes: {},
    };
  },

  methods: {
    open(name: string) {
      let opened = this.holes[name];

      if (!opened) {
        const wormhole = this;
        const hole = {
          name,
          transports: {},
          remote: null,
          addTransport(id, transport) {
            Vue.set(this.transports, id, transport);
          },
          delTransport(id) {
            Vue.delete(this.transports, id);
          },
          transfer(transport) {
            console.log('transfer legacy', transport);
            const { to, payload } = transport;
            const remote = wormhole.open(to);

            if (this.remote) {
              this.remote.delTransport(this.name);
            }
            if (payload) {
              remote.addTransport(this.name, transport);
            }

            this.remote = remote;
          },
          close() {
            if (this.remote) {
              this.remote.delTransport(this.name);
            }
            Vue.delete(wormhole.holes, this.name);
          },
        };

        Vue.set(this.holes, name, hole);

        opened = hole;
      }

      return opened;
    },

    transfer(transport) {
      this.open(transport.from).transfer(transport);
    },

    transports(name) {
      const hole = this.holes[name];
      const transports = [];
      console.log('transport legacy', transports);

      if (!hole) return transports;

      const keys = Object.keys(hole.transports);

      if (keys.length === 0) return transports;

      keys.forEach((key) => {
        transports.push(hole.transports[key]);
      });

      transports.sort((x, y) => x.order || 0 - y.order || 0);

      return transports;
    },
  },
});

export default new Wormhole();
