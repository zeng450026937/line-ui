import * as components from '@line-ui/line/src/components';
import * as controllers from '@line-ui/line/src/controllers';
import * as directives from '@line-ui/line/src/directives';
import { install } from '@line-ui/line/src/install';
import { LineOptions } from '@line-ui/line/src/install';
import * as mixins from '@line-ui/line/src/mixins';
import { VueConstructor } from 'vue';

declare const _default: {
    install(Vue: VueConstructor<import("vue").default>, opts?: LineOptions | undefined): void;
    components: typeof components;
    directives: typeof directives;
    controllers: typeof controllers;
    mixins: typeof mixins;
    version: string;
};
export default _default;

export declare const Skyline: {
    install: typeof install;
    version: string;
};

export * from "@line-ui/line/src/components";
export * from "@line-ui/line/src/controllers";
export * from "@line-ui/line/src/directives";
export * from "@line-ui/line/src/mixins";
export * from "@line-ui/line/src/utils/bem";
export * from "@line-ui/line/src/utils/component";
export * from "@line-ui/line/src/utils/namespace";

export { }
