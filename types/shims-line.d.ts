declare let $tr: (...args: string[]) => string;
declare let $config: (...args: any[]) => string;

interface I18NRuntime {
  [key: string]: string | number | null | undefined;
}
declare const __I18N_RUNTIME__: I18NRuntime;

interface ConfigRuntime {
  [key: string]: string | number | null | undefined;
}
declare const __CONFIG_RUNTIME__: ConfigRuntime;
