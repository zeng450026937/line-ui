<template>
  <div class="page-wrapper">
    <main class="demo-wrapper">
      <article>
        <router-view name="readme"></router-view>
      </article>
    </main>

    <router-view name="gallery"></router-view>

    <line-card v-if="false">
      <img src="./asserts/madison.jpg" />

      <line-card-header>
        <line-card-subtitle>Destination</line-card-subtitle>
        <line-card-title>Madison, WI</line-card-title>
      </line-card-header>

      <line-card-content>
        Founded in 1829 on an isthmus between Lake Monona and Lake Mendota,
        Madison was named the capital of the Wisconsin Territory in 1836.
      </line-card-content>
    </line-card>

    <div class="gallery-wrapper">
      <div class="gallery-toggle"></div>
      <div class="gallery-device">
        <figure>
          <iframe
            ref="device"
            :src="src"
            frameborder="0"
            style="width: 320px; height: 680px;"
          >
          </iframe>
        </figure>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'line-home',

  data() {
    return {
      src: '/mobile/home',
    };
  },

  mounted() {
    const { device } = this.$refs;
    if (!device) return;
    (device as HTMLFrameElement).onload = () => {
      this.changePath(this.$route);
    };
  },

  watch: {
    $route(val) {
      this.changePath(val);
    },
  },

  methods: {
    changePath(route: any) {
      const { path } = route;
      const { device } = this.$refs;

      if (device) {
        setTimeout(() => {
          this.src = `/mobile/home${path}`;
        }, 0);
      }
    },
  },
});
</script>

<style lang="scss">
.page-wrapper {
  display: flex;
  position: relative;

  flex-direction: row;

  height: 100%;

  margin-left: 240px;

  transition: transform 0.2s cubic-bezier(0.2, 1, 0.2, 1),
    -webkit-transform 0.2s cubic-bezier(0.2, 1, 0.2, 1);

  font-size: 15px;

  line-height: 2;

  overflow-x: hidden;
}

.demo-wrapper {
  position: relative;

  min-width: 500px;

  margin-bottom: 3rem;
  margin-left: auto;

  padding: 2rem 3rem;
}

.gallery-wrapper {
  position: sticky;

  top: 0px;

  margin-right: auto;
}
.gallery-content {
  display: flex;

  align-items: center;
  justify-content: center;

  height: 100%;
}

.gallery-device {
  --device-aspect-ratio: 2.125;
  --device-padding: 2rem;

  position: sticky;

  top: 0;

  padding: var(--device-padding);

  & > figure {
    position: relative;

    width: calc(
      (100vh - var(--header-height, 56px) - var(--device-padding) * 2) /
        var(--device-aspect-ratio)
    );
    min-width: 320px;
    max-width: 320px;

    height: 0;

    margin: 0;

    padding-bottom: calc(var(--device-aspect-ratio) * 100%);

    border-radius: 32px;

    background-color: rgba(0, 0, 0, 0.02);

    box-shadow: 0 0 0 14px #090a0d, 0 0 0 17px #9fa3a8,
      0 0 34px 17px rgba(0, 0, 0, 0.2);

    overflow: hidden;

    z-index: 1;
  }

  & > figure::after {
    display: block;
    position: absolute;

    bottom: 6px;
    left: 50%;

    width: 35%;
    height: 4px;

    transform: translateX(-50%);

    border-radius: 2px;

    background-color: rgba(0, 0, 0, 0.5);

    content: '';
    z-index: 1;
  }
}
</style>
