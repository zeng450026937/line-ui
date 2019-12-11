import { isNumber } from '@/utils/validate/number';
import { isDef } from '@/utils/helpers';

export function addUnit(value?: string | number): string | undefined {
  if (!isDef(value)) {
    return undefined;
  }

  value = String(value);
  return isNumber(value) ? `${ value }px` : value;
}
