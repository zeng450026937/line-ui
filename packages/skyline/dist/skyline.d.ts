import * as components from 'skyline/components';
import * as directives from 'skyline/directives';
import { install } from 'skyline/install';
import { LineOptions } from 'skyline/install';
import * as mixins from 'skyline/mixins';
import { VueConstructor } from 'vue';

declare const _default: {
    install(Vue: VueConstructor<import("vue").default>, opts?: LineOptions | undefined): void;
    components: typeof components;
    directives: typeof directives;
    mixins: typeof mixins;
    version: string;
};
export default _default;

export declare const Skyline: {
    install: typeof install;
    version: string;
};

export * from "skyline/components";
export * from "skyline/directives";
export * from "skyline/mixins";

export { }
