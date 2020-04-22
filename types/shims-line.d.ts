declare let $tr: (key: string, ...args: any[]) => string;
declare let $config: (key: string, ...args: any[]) => string;

interface I18NRuntime {
  [key: string]: string | number;
}
declare const __I18N_RUNTIME__: I18NRuntime;

interface ConfigRuntime {
  [key: string]: string | number | undefined;
}
declare const __CONFIG_RUNTIME__: ConfigRuntime;
