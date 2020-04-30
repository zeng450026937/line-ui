<template>
  <div class="template-explorer">
    <iframe
      ref="iframe"
      title="Template Explorer"
      sandbox="allow-same-origin allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals"
      :srcdoc="srcdoc"
    ></iframe>

    <div class="overlay">
      <Message v-if="error" :detail="error" kind="error"></Message>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Message from './Message.vue';
import { ReplProxy } from './repl-proxy';
/* eslint-disable-next-line */
import srcdoc from '!!../../../string-loader/index.js!./srcdoc/index.html';

// TODO
// show console logs
export default Vue.extend({
  components: { Message },

  props: {
    source: String,
  },

  data() {
    const logs = [];
    const currentLogGroup = logs;

    return {
      srcdoc,

      error: null,
      logs,
      logGroupStack: [],
      currentLogGroup,

      pendingImports: 0,
      pending: false,

      ready: false,
      inited: false,

      logHeight: 90,
      prevHeight: 0,

      lastConsoleEvent: null,
    };
  },

  mounted() {
    const { iframe } = this.$refs;

    this.proxy = new ReplProxy(iframe, {
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
      this.$emit('ready', this.ready);
      this.eval(this.source);
    });
  },

  watch: {
    source: 'eval',
  },

  methods: {
    async eval(source) {
      if (this.ready && source) {
        try {
          this.clearLogs();
          await this.proxy.eval(source);
          this.error = null;
        } catch (error) {
          this.showError(error);
        }
      }
    },

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

<style lang="scss" scoped>
.template-explorer {
  position: relative;

  width: 100%;
  min-width: 344px;

  height: 100%;
  min-height: 704px;

  iframe {
    display: block;

    width: 100%;
    height: 100%;

    border: none;

    overflow: hidden;
  }

  .overlay {
    position: absolute;
    bottom: 0;

    width: 100%;
  }
}
</style>
