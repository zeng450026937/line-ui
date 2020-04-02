import { PickerOptions } from '@line-ui/line/src/components/picker/picker-interface';

export * from '@line-ui/line/src/components/picker/picker-interface';

export type DatetimeOptions = Partial<PickerOptions>;

export interface DatetimeChangeEventDetail {
  value: string | undefined | null;
}
