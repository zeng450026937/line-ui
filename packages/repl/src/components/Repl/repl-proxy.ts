let uid = 1;

export interface ReplProxyHandlers {
  onFetchProgress: (remaining: number) => void;
  onError: (error: any) => void;
  onUnhandledRejection: (error: any) => void;
  onConsole: (data: any) => void;
  onConsoleGroup: (data: any) => void;
  onConsoleGroupEnd: (data: any) => void;
  onConsoleGroupCollapsed: (data: any) => void;
}

export class ReplProxy {
  iframe: HTMLIFrameElement;
  handlers: ReplProxyHandlers;

  pendingCmds: Map<
    number,
    {
      resolve: (data: any) => void;
      reject: (error: any) => void;
    }
  >;

  handleEvent: (event: MessageEvent) => void;

  constructor(iframe: HTMLIFrameElement, handlers: ReplProxyHandlers) {
    this.iframe = iframe;
    this.handlers = handlers;

    this.pendingCmds = new Map();

    this.handleEvent = (e: MessageEvent) => this.handleReplMessage(e);
    window.addEventListener('message', this.handleEvent, false);
  }

  destroy() {
    window.removeEventListener('message', this.handleEvent);
  }

  iframeCommand(action: string, args: any) {
    return new Promise((resolve, reject) => {
      const cmdId = uid++;

      this.pendingCmds.set(cmdId, { resolve, reject });

      this.iframe.contentWindow!.postMessage({ action, cmdId, args }, '*');
    });
  }

  handleCommandMessage(data: any) {
    const { action } = data;
    const id = data.cmdId;
    const handler = this.pendingCmds.get(id);

    if (handler) {
      this.pendingCmds.delete(id);
      if (action === 'cmd_error') {
        const { message, stack } = data;
        const e = new Error(message);
        e.stack = stack;
        handler.reject(e);
      }

      if (action === 'cmd_ok') {
        handler.resolve(data.args);
      }
    } else {
      console.error('command not found', id, data, [
        ...this.pendingCmds.keys(),
      ]);
    }
  }

  handleReplMessage(event: MessageEvent) {
    if (event.source !== this.iframe.contentWindow) return;

    const { action, args } = event.data;

    switch (action) {
      case 'cmd_error':
      case 'cmd_ok':
        return this.handleCommandMessage(event.data);
      case 'fetch_progress':
        return this.handlers.onFetchProgress(args.remaining);
      case 'error':
        return this.handlers.onError(event.data);
      case 'unhandledrejection':
        return this.handlers.onUnhandledRejection(event.data);
      case 'console':
        return this.handlers.onConsole(event.data);
      case 'console_group':
        return this.handlers.onConsoleGroup(event.data);
      case 'console_group_collapsed':
        return this.handlers.onConsoleGroupCollapsed(event.data);
      case 'console_group_end':
        return this.handlers.onConsoleGroupEnd(event.data);
      default:
        break;
    }
  }

  eval(script: string) {
    return this.iframeCommand('eval', { script });
  }

  handleLinks() {
    return this.iframeCommand('catch_clicks', {});
  }
}
