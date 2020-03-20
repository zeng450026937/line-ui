<template>
  <div class="device-home">
    <svg
      class="device-system-bar"
      viewBox="0 0 1384.3 40.3"
    >
      <path
        class="st0"
        d="M1343 5l18.8 32.3c.8 1.3 2.7 1.3 3.5 0L1384 5c.8-1.3-.2-3-1.7-3h-37.6c-1.5 0-2.5 1.7-1.7 3z"
      ></path>
      <circle
        class="st0"
        cx="1299"
        cy="20.2"
        r="20"
      ></circle>
      <path
        class="st0"
        d="M1213 1.2h30c2.2 0 4 1.8 4 4v30c0 2.2-1.8 4-4 4h-30c-2.2 0-4-1.8-4-4v-30c0-2.3
        1.8-4 4-4zM16 4.2h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H16c-8.8 0-16-7.2-16-16s7.2-16 16-16z"
      >
      </path>
    </svg>
    <svg
      class="device-notch"
      viewBox="0 0 219 31"
    >
      <path
        d="M0 1V0h219v1a5 5 0 0 0-5 5v3c0 12.15-9.85 22-22 22H27C14.85 31 5 21.15 5 9V6a5 5 0 0 0-5-5z"
        fill-rule="evenodd"
      >
      </path>
    </svg>
    <div class="device-screen line-page">
      <line-header translucent v-if="false">
        <line-toolbar>
          <line-title>SKYLINE</line-title>
        </line-toolbar>
      </line-header>
      <router-view ref="usage" name="usage"></router-view>
      <line-content v-if="false">
        <div class="gallery-content">
          <line-spinner type="dots"></line-spinner>
        </div>
      </line-content>
    </div>
  </div>
</template>

<script>
export default {
  name : 'DeviceHome',

  data() {
    return {

    };
  },
};
</script>

<style lang="scss" scoped>
.device-system-bar {
  display: block;
  position: relative;

  width: 100%;

  padding: 0.5rem 1rem;

  opacity: 0.1;

  z-index: 2;

  fill: #090a0d;
}

.device-notch {
  display: block;
  position: absolute;

  top: -1px;
  left: 50%;

  width: 165px;

  transform: translateX(-50%);

  fill: #090a0d;

  z-index: 2;
}

.device-screen {
  --line-safe-area-top: 20px;
  --line-safe-area-bottom: 22px;

  line-height: initial;
}
</style>
