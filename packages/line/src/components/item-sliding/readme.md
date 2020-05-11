# ItemSliding

A sliding item contains an item that can be dragged to reveal buttons. It requires an `item` component as a child. All options to reveal should be placed in the `item` element.

## Props

| property | description | type | default |
|----------|-------------|------|---------|

## Events

## Methods

### Swipe Direction

By default, the buttons are placed on the `"end"` side. This means that options are revealed when the sliding item is swiped from end to start, i.e. from right to left in LTR, but from left to right in RTL. To place them on the opposite side, so that they are revealed when swiping in the opposite direction, set the `side` attribute to `"start"` on the `line-item-options` element. Up to two `line-item-options` can be used at the same time in order to reveal two different sets of options depending on the swiping direction.

### Options Layout

By default if an icon is placed with text in the `item option`, it will display the icon on top of the text, but the icon slot can be changed to any of the following to position it in the option.

| Slot        | Description                                                              |
| ----------- | ------------------------------------------------------------------------ |
| `start`     | In LTR, start is the left side of the button, and in RTL it is the right |
| `top`       | The icon is above the text                                               |
| `icon-only` | The icon is the only content of the button                               |
| `bottom`    | The icon is below the text                                               |
| `end`       | In LTR, end is the right side of the button, and in RTL it is the left   |

### Expandable Options

Options can be expanded to take up the full width of the item if you swipe past a certain point. This can be combined with the `swipe` event to call methods on the class.
