# ReorderGroup

The reorder group is a wrapper component for items using the `line-reorder` component. See the `Reorder` for further information about the anchor component that is used to drag items within the `line-reorder-group`.

Once the user drags an item and drops it in a new position, the `reorder` event is dispatched. A handler for it should be implemented that calls the `complete()` method.

The `detail` property of the `reorder` event includes all of the relevant information about the reorder operation, including the `from` and `to` indexes. In the context of reordering, an item moves `from` an index `to` a new index.

## Props

| property | description | type | default |
|----------|-------------|------|---------|

## Events

## Methods
