import * as components from 'skyline/src/components';
import * as directives from 'skyline/src/directives';
import { install } from 'skyline/src/install';
import { LineOptions } from 'skyline/src/install';
import * as mixins from 'skyline/src/mixins';
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

export * from "skyline/src/components";
export * from "skyline/src/directives";
export * from "skyline/src/mixins";

export { }
