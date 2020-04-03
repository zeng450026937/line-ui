import Vue, { VNode } from 'vue';

export type Payload = {
  from?: string;
  to: string;
  order: number;
  slot?: () => VNode;
};

export interface Portal {
  id: string;
  payloads: { [key: string]: Payload };
  remote: Portal | null;
  addOrUpdatePayload: (remoteId: string, payload: Payload) => void;
  removePayload: (remoteId: string) => void;
  transfer: (payload: Payload) => void;
  close: () => void;
}

type PortalData = {
  portals: { [key: string]: Portal };
};

export const PortalContext = Vue.extend({
  data(): PortalData {
    return {
      portals: {},
    };
  },

  methods: {
    open(id: string) {
      let opened = this.portals[id];

      if (!opened) {
        const context = this;
        const portal = {
          _isVue: true,
          id,
          payloads: Vue.observable({}),
          remote: null,
          addOrUpdatePayload(remoteId: string, payload: Payload) {
            Vue.set(this.payloads, remoteId, payload);
          },
          removePayload(remoteId: string) {
            Vue.delete(this.payloads, remoteId);
          },
          transfer(payload: Payload | null) {
            if (!payload) return;

            payload.from = id;
            const { to, slot } = payload;
            const remote = context.open(to);

            if (this.remote) {
              this.remote!.removePayload(id);
            }
            if (slot) {
              remote.addOrUpdatePayload(id, payload);
            }
            this.remote = remote;
          },
          close() {
            if (this.remote) {
              this.remote.removePayload(this.id);
            }
            Vue.delete(context.portals, this.id);
          },
        } as Portal;

        Vue.set(this.portals, id, portal);
        opened = portal;
      }

      return opened;
    },

    transfer(payload: Payload) {
      this.open(payload.from!).transfer(payload);
    },

    payloads(id: string) {
      const portal = this.portals[id];
      const payloads: Array<Payload> = [];

      if (!portal) return payloads;

      const keys = Object.keys(portal.payloads);

      if (keys.length === 0) return payloads;

      keys.forEach((key: string) => {
        payloads.push(portal.payloads[key]);
      });

      // payloads.sort((x, y) => x.order || 0 - y.order || 0);

      return payloads;
    },
  },
});

export function setupPortal() {
  return new PortalContext();
}
