<template>
  <div class="viewer">
    <iframe
      ref="iframe"
      title="Template Explorer"
      :class="{ inited, 'greyed-out': error || pending || pendingImports }"
      :sandbox="`allow-same-origin allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals`"
      :srcdoc="srcdoc"
    ></iframe>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ReplProxy } from './repl-proxy';
import srcdoc from './srcdoc';

export default Vue.extend({
  props: {
    status: String,
    relaxed: Boolean,
    injectedJS: String,
    injectedCSS: String,
  },

  data() {
    return {
      srcdoc,

      error: null,
      logs: [],
      logGroupStack: [],
      currentLogGroup: [],

      pendingImports: 0,
      pending: false,

      proxy: null,
      ready: false,
      inited: false,

      logHeight: 90,
      prevHeight: 0,

      lastConsoleEvent: null,
    };
  },

  inject: ['REPL'],

  async mounted() {
    await this.$nextTick();
    const { iframe } = this.$refs;

    this.proxy = new ReplProxy(iframe, {
      onFetchProgress: (progress) => {
        this.pendingImports = progress;
      },
      onError: (event) => {
        this.pushLogs({ level: 'error', args: [event.value] });
      },
      onUnhandledRejection: (event) => {
        let error = event.value;
        if (typeof error === 'string') error = { message: error };
        error.message = `Uncaught (in promise): ${error.message}`;
        this.pushLogs({ level: 'error', args: [error] });
      },
      onConsole: (log) => {
        if (log.level === 'clear') {
          this.clearLogs();
          this.pushLogs(log);
        } else if (log.duplicate) {
          this.incrementDuplicateLog();
        } else {
          this.pushLogs(log);
        }
      },
      onConsoleGroup: (action) => {
        this.groupLogs(action.label, false);
      },
      onConsoleGroupEnd: () => {
        this.ungroupLogs();
      },
      onConsoleGroupCollapsed: (action) => {
        this.groupLogs(action.label, true);
      },
    });

    iframe.addEventListener('load', () => {
      this.proxy.handleLinks();
      this.ready = true;
    });

    window.iframe = this.proxy;

    this.$watch(
      () => this.REPL.result,
      (result) => {
        this.proxy.eval(result);
      }
    );
  },

  methods: {
    showError(e) {
      this.error = e;
    },

    pushLogs(log) {
      this.currentLogGroup.push((this.lastConsoleEvent = log));
    },

    groupLogs(label, collapsed) {
      const groupLog = { level: 'group', label, collapsed, logs: [] };
      this.currentLogGroup.push(groupLog);
      this.logGroupStack.push(this.currentLogGroup);
      this.currentLogGroup = groupLog.logs;
    },

    ungroupLogs() {
      this.currentLogGroup = this.logGroupStack.pop();
    },

    incrementDuplicateLog() {
      const lastLog = this.currentLogGroup[this.currentLogGroup.length - 1];

      if (lastLog) {
        lastLog.count = (lastLog.count || 1) + 1;
      } else {
        this.lastConsoleEvent.count = 1;
        this.pushLogs(this.lastConsoleEvent);
      }
    },

    onToggleConsole() {
      if (this.logHeight < 90) {
        this.prevHeight = this.logHeight;
        this.logHeight = 90;
      } else {
        this.logHeight = this.prevHeight || 45;
      }
    },

    clearLogs() {
      this.currentLogGroup = this.logs = [];
    },
  },
});
</script>

<style lang="scss">
.viewer {
  position: absolute;

  width: 100%;
  height: 100%;

  border: none;

  background-color: white;

  iframe {
    display: block;

    width: 100%;
    height: 100%;
    /* height: calc(100vh - var(--nav-h)); */
    border: none;

    overflow: hidden;
  }
}
</style>
