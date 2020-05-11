# ItemOptions

The option buttons for an `line-item-sliding`. These buttons can be placed either on the [start or end side](#side-description).
You can combine the `swipe` event plus the `expandable` directive to create a full swipe action for the item.

## Props

| property | description | type | default |
|----------|-------------|------|---------|

## Events

## Methods

### Side Description

| Side    | Position                                                        | Swipe Direction                                                   |
|---------|-----------------------------------------------------------------|-------------------------------------------------------------------|
| `start` | To the `left` of the content in LTR, and to the `right` in RTL. | From `left` to `right` in LTR, and from `right` to `left` in RTL. |
| `end`   | To the `right` of the content in LTR, and to the `left` in RTL. | From `right` to `left` in LTR, and from `left` to `right` in RTL. |
