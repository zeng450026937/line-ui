import { createNamespace } from 'skyline/src/utils/namespace';
import { PickerController } from 'skyline/src/controllers';
import { useModel } from 'skyline/src/mixins/use-model';
import {
  PickerColumn,
  PickerColumnOption,
} from 'skyline/src/components/datetime/datetime-interface';
import {
  convertDataToISO,
  convertFormatToKey,
  convertToArrayOfNumbers,
  convertToArrayOfStrings,
  dateDataSortValue,
  dateSortValue,
  dateValueRange,
  daysInMonth,
  getDateValue,
  getTimezoneOffset,
  parseDate,
  parseTemplate,
  renderDatetime,
  renderTextFormat,
  updateDate,
} from 'skyline/src/components/datetime/datetime-util';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('datetime');

const clamp = (min: number, n: number, max: number) => {
  return Math.max(min, Math.min(n, max));
};

const findItemLabel = (componentEl: HTMLElement) => {
  const itemEl = componentEl && componentEl.closest('.line-item');
  if (itemEl) {
    return itemEl.querySelector('.line-label');
  }
  return null;
};

const divyColumns = (columns: PickerColumn[]): PickerColumn[] => {
  const columnsWidth: number[] = [];
  let col: PickerColumn;
  let width: number;
  for (let i = 0; i < columns.length; i++) {
    col = columns[i];
    columnsWidth.push(0);

    for (const option of col.options) {
      width = (option.text)!.length;
      if (width > columnsWidth[i]) {
        columnsWidth[i] = width;
      }
    }
  }

  if (columnsWidth.length === 2) {
    width = Math.max(columnsWidth[0], columnsWidth[1]);
    columns[0].align = 'right';
    columns[1].align = 'left';
    columns[0].optionsWidth = columns[1].optionsWidth = `${ width * 17 }px`;
  } else if (columnsWidth.length === 3) {
    width = Math.max(columnsWidth[0], columnsWidth[2]);
    columns[0].align = 'right';
    columns[1].columnWidth = `${ columnsWidth[1] * 17 }px`;
    columns[0].optionsWidth = columns[2].optionsWidth = `${ width * 17 }px`;
    columns[2].align = 'left';
  }
  return columns;
};

const DEFAULT_FORMAT = 'MMM D, YYYY';

let datetimeIds = 0;


export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useModel('dateValue'),
  ],

  inject : {
    Item : { default: undefined },
  },

  props : {
    name     : String,
    disabled : {
      type    : Boolean,
      default : false,
    },
    readonly : {
      type    : Boolean,
      default : false,
    },
    min           : String,
    max           : String,
    displayFormat : {
      type    : String,
      default : 'MMM D, YYYY',
    },
    displayTimezone : String,
    pickerFormat    : String,
    cancelText      : {
      type    : String,
      default : 'Cancel',
    },
    doneText : {
      type    : String,
      default : 'Done',
    },
    yearValues      : [Array, Number, String],
    monthValues     : [Array, Number, String],
    dayValues       : [Array, Number, String],
    hourValues      : [Array, Number, String],
    minuteValues    : [Array, Number, String],
    monthNames      : [Array, String],
    monthShortNames : [Array, String],
    dayNames        : [Array, String],
    dayShortNames   : [Array, String],
    pickerOptions   : Object,
    placeholder     : String,
  },

  data() {
    return {
      isExpanded : false,
      dateMax    : '',
      dateMin    : '',
      inputId    : `line-dt-${ datetimeIds++ }`,

      locale : {},
      inItem : false,
    };
  },

  computed : {
    text() {
      // create the text of the formatted data
      const template = this.displayFormat || this.pickerFormat || DEFAULT_FORMAT;

      if (this.dateValue === undefined || this.dateValue === null || this.dateValue.length === 0) {
        return undefined;
      }

      return renderDatetime(template, this.datetimeValue, this.locale);
    },
  },

  beforeMount() {
    const { min, max } = this;
    this.dateMin = min;
    this.dateMax = max;
    this.datetimeMin = {};
    this.datetimeMax = {};
    this.datetimeValue = {};

    const monthNames = this.monthNames as string[];
    const monthShortNames = this.monthShortNames as string[];
    const dayNames = this.dayNames as string[];
    const dayShortNames = this.dayShortNames as string[];

    // first see if locale names were provided in the inputs
    // then check to see if they're in the config
    // if neither were provided then it will use default English names
    this.locale = {
      // this.locale[type] = convertToArrayOfStrings((this[type] ? this[type] : this.config.get(type), type);
      monthNames      : convertToArrayOfStrings(monthNames, 'monthNames'),
      monthShortNames : convertToArrayOfStrings(monthShortNames, 'monthShortNames'),
      dayNames        : convertToArrayOfStrings(dayNames, 'dayNames'),
      dayShortNames   : convertToArrayOfStrings(dayShortNames, 'dayShortNames'),
    };

    this.updateDatetimeValue(this.dateValue);

    // TODO
    this.emitStyle();
  },

  mounted() {
    const { buttonEl } = this.$refs;
    this.inItem = this.$el.closest('.line-item') !== null;
    this.buttonEl = buttonEl;
  },

  methods : {
    /**
     * Opens the datetime overlay.
     */
    async open() {
      if (this.disabled || this.isExpanded) {
        return;
      }

      const pickerOptions = this.generatePickerOptions();
      const pickerController = PickerController;
      const picker = await pickerController.create(pickerOptions);

      this.isExpanded = true;
      picker.$on('opened', () => {
        this.$emit('opened');
      });

      picker.$on('closed', () => {
        this.isExpanded = false;
        this.setFocus();
        this.$emit('closed');
      });

      picker.$on('colChange', (data: any) => {
        const colSelectedIndex = data.selectedIndex;
        const colOptions = data.options;

        const changeData: any = {};
        changeData[data.name] = {
          value : colOptions[colSelectedIndex].value,
        };

        this.updateDatetimeValue(changeData);
        picker.columns = this.generateColumns();
      });

      await picker.open();
    },

    emitStyle(): void {
      this.Item && this.Item.itemStyle(
        'datatime',
        {
          interactive            : true,
          datetime               : true,
          'has-placeholder'      : this.placeholder != null,
          'has-value'            : this.hasValue(),
          'interactive-disabled' : this.disabled,
        },
      );
    },

    updateDatetimeValue(value: any): void {
      updateDate(this.datetimeValue, value, this.displayTimezone);
    },

    generatePickerOptions(): any {
      const { mode } = this;
      const pickerOptions: any = {
        mode,
        ...this.pickerOptions,
        columns : this.generateColumns(),
      };

      // If the user has not passed in picker buttons,
      // add a cancel and ok button to the picker
      const { buttons } = pickerOptions;
      if (!buttons || buttons.length === 0) {
        pickerOptions.buttons = [
          {
            text    : this.cancelText,
            role    : 'cancel',
            handler : () => {
              this.updateDatetimeValue(this.dateValue);
              // this.ionCancel.emit();
              this.$emit('cancel');
            },
          },
          {
            text    : this.doneText,
            handler : (data: any) => {
              this.updateDatetimeValue(data);

              /**
             * Prevent convertDataToISO from doing any
             * kind of transformation based on timezone
             * This cancels out any change it attempts to make
             *
             * Important: Take the timezone offset based on
             * the date that is currently selected, otherwise
             * there can be 1 hr difference when dealing w/ DST
             */
              const date = new Date(convertDataToISO(this.datetimeValue));

              // If a custom display timezone is provided, use that tzOffset value instead
              this.datetimeValue.tzOffset = (this.displayTimezone !== undefined && this.displayTimezone.length > 0)
                ? ((getTimezoneOffset(date, this.displayTimezone)) / 1000 / 60) * -1
                : date.getTimezoneOffset() * -1;

              this.dateValue = convertDataToISO(this.datetimeValue);
            },
          },
        ];
      }
      return pickerOptions;
    },

    generateColumns(): PickerColumn[] {
      // if a picker format wasn't provided, then fallback
      // to use the display format
      let template = this.pickerFormat || this.displayFormat || DEFAULT_FORMAT;
      if (template.length === 0) {
        return [];
      }
      // make sure we've got up to date sizing information
      this.calcMinMax();

      // does not support selecting by day name
      // automatically remove any day name formats
      template = template.replace('DDDD', '{~}').replace('DDD', '{~}');
      if (template.indexOf('D') === -1) {
      // there is not a day in the template
      // replace the day name with a numeric one if it exists
        template = template.replace('{~}', 'D');
      }
      // make sure no day name replacer is left in the string
      template = template.replace(/{~}/g, '');

      // parse apart the given template into an array of "formats"
      const columns = parseTemplate(template).map((format: any) => {
        // loop through each format in the template
        // create a new picker column to build up with data
        const key = convertFormatToKey(format)!;
        let values: any[];

        // check if they have exact values to use for this date part
        // otherwise use the default date part values
        const self = this as any;
        /* eslint-disable-next-line */
        values = self[`${ key }Values`]
          ? convertToArrayOfNumbers(self[`${ key }Values`], key)
          : dateValueRange(format, this.datetimeMin, this.datetimeMax);

        const colOptions = values.map(val => {
          return {
            value : val,
            text  : renderTextFormat(format, val, undefined, this.locale),
          };
        });

        // cool, we've loaded up the columns with options
        // preselect the option for this column
        const optValue = getDateValue(this.datetimeValue, format);

        const selectedIndex = colOptions.findIndex(opt => opt.value === optValue);

        return {
          name          : key,
          selectedIndex : selectedIndex >= 0 ? selectedIndex : 0,
          options       : colOptions,
        };
      });

      // Normalize min/max
      const min = this.datetimeMin as any;
      const max = this.datetimeMax as any;
      ['month', 'day', 'hour', 'minute']
        .filter(name => !columns.find(column => column.name === name))
        .forEach(name => {
          min[name] = 0;
          max[name] = 0;
        });

      return this.validateColumns(divyColumns(columns));
    },
    validateColumns(columns: PickerColumn[]) {
      const today = new Date();
      const minCompareVal = dateDataSortValue(this.datetimeMin);
      const maxCompareVal = dateDataSortValue(this.datetimeMax);
      const yearCol = columns.find(c => c.name === 'year');

      let selectedYear: number = today.getFullYear();
      if (yearCol) {
        // default to the first value if the current year doesn't exist in the options
        if (!yearCol.options.find((col: any) => col.value === today.getFullYear())) {
          selectedYear = yearCol.options[0].value;
        }

        const { selectedIndex } = yearCol;
        if (selectedIndex !== undefined) {
          const yearOpt = yearCol.options[selectedIndex] as PickerColumnOption | undefined;
          if (yearOpt) {
            // they have a selected year value
            selectedYear = yearOpt.value;
          }
        }
      }

      const selectedMonth = this.validateColumn(columns,
        'month', 1,
        minCompareVal, maxCompareVal,
        [selectedYear, 0, 0, 0, 0],
        [selectedYear, 12, 31, 23, 59]);

      const numDaysInMonth = daysInMonth(selectedMonth, selectedYear);
      const selectedDay = this.validateColumn(columns,
        'day', 2,
        minCompareVal, maxCompareVal,
        [selectedYear, selectedMonth, 0, 0, 0],
        [selectedYear, selectedMonth, numDaysInMonth, 23, 59]);

      const selectedHour = this.validateColumn(columns,
        'hour', 3,
        minCompareVal, maxCompareVal,
        [selectedYear, selectedMonth, selectedDay, 0, 0],
        [selectedYear, selectedMonth, selectedDay, 23, 59]);

      this.validateColumn(columns,
        'minute', 4,
        minCompareVal, maxCompareVal,
        [selectedYear, selectedMonth, selectedDay, selectedHour, 0],
        [selectedYear, selectedMonth, selectedDay, selectedHour, 59]);

      return columns;
    },

    calcMinMax() {
      const todaysYear = new Date().getFullYear();

      if (this.yearValues !== undefined) {
        const years = convertToArrayOfNumbers(this.yearValues, 'year');

        if (this.dateMin === undefined) {
          this.dateMin = Math.min(...years).toString();
        }
        if (this.dateMax === undefined) {
          this.dateMax = Math.max(...years).toString();
        }
      } else {
        if (this.dateMin === undefined) {
          this.dateMin = (todaysYear - 100).toString();
        }
        if (this.dateMax === undefined) {
          this.dateMax = todaysYear.toString();
        }
      }
      const min = this.datetimeMin = parseDate(this.dateMin)!;
      const max = this.datetimeMax = parseDate(this.dateMax)!;

      min.year = min.year || todaysYear;
      max.year = max.year || todaysYear;

      min.month = min.month || 1;
      max.month = max.month || 12;
      min.day = min.day || 1;
      max.day = max.day || 31;
      min.hour = min.hour || 0;
      max.hour = max.hour === undefined ? 23 : max.hour;
      min.minute = min.minute || 0;
      max.minute = max.minute === undefined ? 59 : max.minute;
      min.second = min.second || 0;
      max.second = max.second === undefined ? 59 : max.second;

      // Ensure min/max constraints
      if (min.year > max.year) {
        __DEV__ && console.error('min.year > max.year');
        min.year = max.year - 100;
      }
      if (min.year === max.year) {
        if (min.month > max.month) {
          __DEV__ && console.error('min.month > max.month');
          min.month = 1;
        } else if (min.month === max.month && min.day > max.day) {
          __DEV__ && console.error('min.day > max.day');
          min.day = 1;
        }
      }
    },

    validateColumn(columns: PickerColumn[], name: string, index: number,
      min: number, max: number, lowerBounds: number[], upperBounds: number[]): number {
      const column = columns.find(c => c.name === name);
      if (!column) {
        return 0;
      }

      const lb = lowerBounds.slice();
      const ub = upperBounds.slice();
      const { options } = column;
      let indexMin = options.length - 1;
      let indexMax = 0;

      for (let i = 0; i < options.length; i++) {
        const opts = options[i];
        const { value } = opts;
        lb[index] = opts.value;
        ub[index] = opts.value;

        const disabled = opts.disabled = (
          value < lowerBounds[index]
        || value > upperBounds[index]
        || dateSortValue(ub[0], ub[1], ub[2], ub[3], ub[4]) < min
        || dateSortValue(lb[0], lb[1], lb[2], lb[3], lb[4]) > max
        );
        if (!disabled) {
          indexMin = Math.min(indexMin, i);
          indexMax = Math.max(indexMax, i);
        }
      }
      const selectedIndex = column.selectedIndex = clamp(indexMin, column.selectedIndex!, indexMax);
      const opt = column.options[selectedIndex] as PickerColumnOption | undefined;
      if (opt) {
        return opt.value;
      }
      return 0;
    },

    hasValue(): boolean {
      return this.text !== undefined;
    },

    setFocus() {
      if (this.buttonEl) {
        this.buttonEl.focus();
      }
    },
    onClick() {
      this.setFocus();
      this.open();
    },

    onFocus() {
      this.$emit('focus');
    },

    onBlur() {
      this.$emit('blur');
    },
  },

  watch : {
    checked() {
      this.emitStyle();
    },

    disabled() {
      this.emitStyle();
    },
  },

  render() {
    const {
      inputId, text, disabled, readonly, isExpanded, $el, placeholder, inItem,
    } = this;

    const labelId = `${ inputId }-lbl`;
    const label = findItemLabel($el as HTMLElement);
    const addPlaceholderClass = !!((text === undefined && placeholder != null));

    // If selected text has been passed in, use that first
    // otherwise use the placeholder
    const datetimeText = text === undefined
      ? (placeholder != null ? placeholder : '')
      : text;

    if (label) {
      label.id = labelId;
    }
    // TODO
    // renderHiddenInput(true, el, this.name, this.dateValue, this.disabled);

    return (
      <div
        onClick={this.onClick}
        role="combobox"
        aria-disabled={disabled ? 'true' : null}
        aria-expanded={`${ isExpanded }`}
        aria-haspopup="true"
        aria-labelledby={labelId}
        class={[
          bem({
            disabled,
            readonly,
            placeholder : addPlaceholderClass,
          }),
          { 'in-item': inItem },
        ]}
      >
        <div class={bem('text')}>{datetimeText}</div>
        <button
          type="button"
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          disabled={this.disabled}
          ref="buttonEl"
        >
      </button>
      </div>
    );
  },
});
