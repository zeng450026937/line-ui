<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>ToolTip</line-title>
      </line-toolbar>
    </line-header>
    <line-tooltip
      ref="tooltip"
      :trigger="triggerButton"
      :openOnHover="true"
      placement="bottom"
      v-model="visible"
      >Button - 1 -> tooltip</line-tooltip
    >
    <!-- secondary tertiary danger medium -->
    <line-content :scrollY="true" class="line-padding">
      <line-button expand="block" ref="button">
        Show ToolTip
      </line-button>
      <line-chip @click="openTooltip" color="warning" ref="chip">
        Show ToolTip
      </line-chip>
      <div style="height: 400px;"></div>

      <line-button expand="block" @click="open" ref="triggerButton">
        Show ToolTip
      </line-button>
    </line-content>
  </line-app>
</template>

<script>
import Vue from 'vue';
import { TooltipController } from '@line-ui/line/src/controllers';

const controller = new TooltipController();

export default Vue.extend({
  data() {
    return {
      trigger: null,
      triggerButton: null,
      visible: false,

      chipTooltip: null,
      buttonToolTip: null,
    };
  },
  methods: {
    open() {
      this.visible = !this.visible;
    },

    openTooltip(ev) {
      if (this.chipTooltip) {
        this.chipTooltip.close();
        this.chipTooltip = null;
        return;
      }

      this.chipTooltip = controller.create({
        text: 'Chip -> Tooltip',
        color: 'medium',
        placement: 'bottom',
      });
      this.chipTooltip.open(ev);
    },
  },

  mounted() {
    this.trigger = this.$refs.chip;
    this.triggerButton = this.$refs.triggerButton;

    this.buttonToolTip = controller.create(
      {
        trigger: this.$refs.button,
        text: 'Button -> Tooltip',
        openOnHover: true,
        color: 'medium',
        placement: 'bottom',
      },
      false
    );
  },
});
</script>

<style lang="scss" scoped></style>
