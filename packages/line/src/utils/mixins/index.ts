/* eslint-disable import/extensions, max-len */

// use createMixins() to create ExtendedVue is only for better working on
// typescript lint(Grammar Check)
import Vue from 'vue';
import { ExtendedVue } from 'vue/types/vue';
import {
  ComponentOptions,
  FunctionalComponentOptions,
  RecordPropsDefinition,
  ThisTypedComponentOptionsWithArrayProps,
  ThisTypedComponentOptionsWithRecordProps,
} from 'vue/types/options';

export function createMixins<
  Events,
  Slots,
  Data,
  Computed,
  Methods,
  PropNames extends string = never
>(
  options?: ThisTypedComponentOptionsWithArrayProps<
    Vue,
    Data,
    Methods,
    Computed,
    PropNames
  >
): ExtendedVue<Vue, Data, Methods, Computed, Record<PropNames, any>>;

export function createMixins<Events, Slots, Data, Methods, Computed, Props>(
  options?: ThisTypedComponentOptionsWithRecordProps<
    Vue,
    Data,
    Methods,
    Computed,
    Props
  >
): ExtendedVue<Vue, Data, Methods, Computed, Props>;

export function createMixins<Events, Slots, PropNames extends string = never>(
  definition: FunctionalComponentOptions<Record<PropNames, any>, PropNames[]>
): ExtendedVue<Vue, {}, {}, {}, Record<PropNames, any>>;

export function createMixins<Events, Slots, Props>(
  definition: FunctionalComponentOptions<Props, RecordPropsDefinition<Props>>
): ExtendedVue<Vue, {}, {}, {}, Props>;

export function createMixins(
  options?: ComponentOptions<Vue>
): ExtendedVue<Vue, {}, {}, {}, {}>;

export function createMixins(options: any) {
  return Vue.extend(options);
}
