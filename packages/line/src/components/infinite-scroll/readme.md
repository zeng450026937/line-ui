# InfiniteScroll

The Infinite Scroll component calls an action to be performed when the user scrolls a specified distance from the bottom or top of the page.

The expression assigned to the `line-infinite` event is called when the user reaches that defined distance. When this expression has finished any and all tasks, it should call the `complete()` method on the infinite scroll instance.

## Props

| property | description | type | default |
|----------|-------------|------|---------|

## Events

## Methods

### Infinite Scroll Content

The `line-infinite-scroll` component has the infinite scroll logic. It requires a child component in order to display content. Ionic uses its `line-infinite-scroll-content` component by default. This component displays the infinite scroll and changes the look depending on the infinite scroll's state. It displays a spinner that looks best based on the platform the user is on. However, the default spinner can be changed and text can be added by setting properties on the `line-infinite-scroll-content` component.

### Custom Content

Separating the `line-infinite-scroll` and `line-infinite-scroll-content` components allows developers to create their own content components, if desired. This content can contain anything, from an SVG element to elements with unique CSS animations.
