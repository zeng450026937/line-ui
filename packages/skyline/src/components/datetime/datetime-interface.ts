import { PickerOptions } from 'skyline/components/picker/picker-interface.d';

export * from 'skyline/components/picker/picker-interface.d';

export type DatetimeOptions = Partial<PickerOptions>;

export interface DatetimeChangeEventDetail {
  value: string | undefined | null;
}
