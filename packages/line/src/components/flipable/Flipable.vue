<template>
  <div class="flipable">
    <div class="flipper">
      <div class="side front">
        <slot name="front">
          <img
            src="http://css3.bradshawenterprises.com/images/Rainbow%20Worm.jpg"
          />
        </slot>
      </div>
      <div class="side back">
        <slot name="back">
          <img src="http://css3.bradshawenterprises.com/images/Turtle.jpg" />
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
// http://css3.bradshawenterprises.com/flip/

export const Side = {
  Front: 0,
  Back: 1,
};

export default {
  name: 'Flipable',

  props: {
    back: {
      type: Object,
      default: () => ({}),
    },
    front: {
      type: Object,
      default: () => ({}),
    },
    side: {
      type: Number,
      default: 0,
    },
  },

  model: {
    prop: 'side',
    event: 'sideChanged',
  },
};
</script>

<style lang="scss">
.flipable {
  position: relative;
  perspective: 1000px;

  width: 450px;
  height: 281px;

  .flipper {
    width: 100%;
    height: 100%;

    transform-style: preserve-3d;

    transition: all 0.6s linear;

    box-shadow: 5px 5px 5px #aaa;
    // will-change: transform;
  }

  &:hover {
    .flipper {
      transform: rotateY(180deg);
    }
  }

  .side {
    position: absolute;

    width: 100%;
    height: 100%;
    backface-visibility: hidden;

    &.front {
      transform: rotateY(0deg);

      background-color: pink;
    }
    &.back {
      transform: rotateY(180deg);

      background-color: aquamarine;
    }
  }
}
</style>
