# Tabs

Tabs are a top level navigation component to implement a tab-based navigation.
The component is a container of individual [Tab](../tab/) components.

The `line-tabs` component does not have any styling and works as a router outlet in order to handle navigation. It does not provide any UI feedback or mechanism to switch between tabs. In order to do so, an `line-tab-bar` should be provided as a direct child of `line-tabs`.

Both `line-tabs` and `line-tab-bar` can be used as standalone elements. They don’t depend on each other to work, but they are usually used together in order to implement a tab-based navigation that behaves like a native app.

The `line-tab-bar` needs a slot defined in order to be projected to the right place in an `line-tabs` component.

## Props

| property | description | type | default |
|----------|-------------|------|---------|

## Events

## Methods
