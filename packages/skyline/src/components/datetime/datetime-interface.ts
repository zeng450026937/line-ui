import { PickerOptions } from 'skyline/src/components/picker/picker-interface';

export * from 'skyline/src/components/picker/picker-interface';

export type DatetimeOptions = Partial<PickerOptions>;

export interface DatetimeChangeEventDetail {
  value: string | undefined | null;
}
