<template>
  <div class="gallery-wrapper">
    <div class="gallery-toggle"></div>

    <div class="gallery-device">
      <figure>
        <svg class="device-system-bar" viewBox="0 0 1384.3 40.3">
          <path
            class="st0"
            d="M1343 5l18.8 32.3c.8 1.3 2.7 1.3 3.5 0L1384 5c.8-1.3-.2-3-1.7-3h-37.6c-1.5 0-2.5 1.7-1.7 3z"
          ></path>
          <circle class="st0" cx="1299" cy="20.2" r="20"></circle>
          <path
            class="st0"
            d="M1213 1.2h30c2.2 0 4 1.8 4 4v30c0 2.2-1.8 4-4 4h-30c-2.2 0-4-1.8-4-4v-30c0-2.3 1.8-4 4-4zM16 4.2h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H16c-8.8 0-16-7.2-16-16s7.2-16 16-16z"
          ></path>
        </svg>
        <svg class="device-notch" viewBox="0 0 219 31">
          <path
            d="M0 1V0h219v1a5 5 0 0 0-5 5v3c0 12.15-9.85 22-22 22H27C14.85 31 5 21.15 5 9V6a5 5 0 0 0-5-5z"
            fill-rule="evenodd"
          ></path>
        </svg>

        <div class="line-page" style="padding-top: 20px;">
          <line-header>
            <line-toolbar>
              <line-title>SKYLINE</line-title>
            </line-toolbar>
          </line-header>

          <line-content style="border-radius: 30px;">
            <div class="gallery-content">
              <line-spinner type="dots"></line-spinner>
            </div>
          </line-content>
        </div>
      </figure>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'line-gallery',
});
</script>

<style lang="scss">
.gallery-wrapper {
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
}
</style>
