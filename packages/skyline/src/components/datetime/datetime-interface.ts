import { PickerOptions } from 'skyline/src/components/picker/picker-interface.d';

export * from 'skyline/src/components/picker/picker-interface.d';

export type DatetimeOptions = Partial<PickerOptions>;

export interface DatetimeChangeEventDetail {
  value: string | undefined | null;
}
