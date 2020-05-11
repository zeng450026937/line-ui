# Toolbar

Toolbars are positioned above or below content. When a toolbar is placed in an `<line-header>` it will appear fixed at the top of the content, and when it is in an `<line-footer>` it will appear fixed at the bottom. Fullscreen content will scroll behind a toolbar in a header or footer. When placed within an `<line-content>`, toolbars will scroll with the content.

## Props

| property | description | type | default |
|----------|-------------|------|---------|

## Events

## Methods

### Buttons

Buttons placed in a toolbar should be placed inside of the `<line-buttons>` element. The `<line-buttons>` element can be positioned inside of the toolbar using a named slot. The below chart has a description of each slot.

| Slot         | Description                                                                                              |
|--------------|----------------------------------------------------------------------------------------------------------|
| `secondary`  | Positions element to the `left` of the content in `ios` mode, and directly to the `right` in `md` mode.  |
| `primary`    | Positions element to the `right` of the content in `ios` mode, and to the far `right` in `md` mode.      |
| `start`      | Positions to the `left` of the content in LTR, and to the `right` in RTL.                                |
| `end`        | Positions to the `right` of the content in LTR, and to the `left` in RTL.                                |


### Borders

In `md` mode, the `<line-header>` will receive a box-shadow on the bottom, and the `<line-footer>` will receive a box-shadow on the top.  In `ios` mode, the `<line-header>` will receive a border on the bottom, and the `<line-footer>` will receive a border on the top.
