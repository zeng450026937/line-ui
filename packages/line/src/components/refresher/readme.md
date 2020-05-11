# Refresher

The refresher provides pull-to-refresh functionality on a content component.
The pull-to-refresh pattern lets a user pull down on a list of data using touch
in order to retrieve more data.

Data should be modified during the refresher's output events. Once the async
operation has completed and the refreshing should end, call `complete()` on the
refresher.

## Props

| property | description | type | default |
|----------|-------------|------|---------|

## Events

## Methods

### Native Refreshers

Both iOS and Android platforms provide refreshers that take advantage of properties exposed by their respective devices that give pull to refresh a fluid, native-like feel.

Certain properties such as `pullMin` and `snapbackDuration` are not compatible because much of the native refreshers are scroll-based. See [Refresher Properties](#properties) for more information.
