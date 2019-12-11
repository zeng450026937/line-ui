/* eslint-disable import/extensions, max-len */

// use createMixins() to create ExtendedVue is only for better working on
// typescript lint(Grammar Check)

import Vue, {
  ComponentOptions,
  FunctionalComponentOptions,
} from 'vue';
import {
  RecordPropsDefinition,
  ThisTypedComponentOptionsWithArrayProps,
  ThisTypedComponentOptionsWithRecordProps,
} from 'vue/types/options';
import { ExtendedVue } from 'vue/types/vue';
import { InjectedKeys, InjectOptions } from '@/utils/types';

export function createMixins<Events, Slots, Data, Computed, Methods, PropNames extends string = never>(
  options?: ThisTypedComponentOptionsWithArrayProps<Vue & InjectedKeys, Data, Methods, Computed, PropNames> & InjectOptions<Events, Slots>
  ): ExtendedVue<Vue & InjectedKeys, Data, Methods, Computed, Record<PropNames, any>>;

export function createMixins<Events, Slots, Data, Methods, Computed, Props>(
  options?: ThisTypedComponentOptionsWithRecordProps<Vue & InjectedKeys, Data, Methods, Computed, Props> & InjectOptions<Events, Slots>
  ): ExtendedVue<Vue & InjectedKeys, Data, Methods, Computed, Props>;

export function createMixins<Events, Slots, PropNames extends string = never>(
  definition: FunctionalComponentOptions<Record<PropNames, any>, PropNames[]> & InjectOptions<Events, Slots>
  ): ExtendedVue<Vue & InjectedKeys, {}, {}, {}, Record<PropNames, any>>;

export function createMixins<Events, Slots, Props>(
  definition: FunctionalComponentOptions<Props, RecordPropsDefinition<Props>> & InjectOptions<Events, Slots>
  ): ExtendedVue<Vue & InjectedKeys, {}, {}, {}, Props>;

export function createMixins(options?: ComponentOptions<Vue & InjectedKeys>): ExtendedVue<Vue & InjectedKeys, {}, {}, {}, {}>;

export function createMixins(options: any) {
  return Vue.extend(options);
}
