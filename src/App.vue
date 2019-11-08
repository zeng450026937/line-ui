<template>
  <application-window title="application-window">
    <abstract-button
      label="aa"
      @click="onClicked"
    >
      <template v-slot:background>
        <div>background</div>
      </template>
      <template v-slot:indicator>
        <div>indicator</div>
      </template>
      <template v-slot:icon>
        <div>icon</div>
      </template>
      <template v-slot:label>
        <div>label</div>
      </template>

      button
    </abstract-button>
    <Button @click="onClicked">Button</Button>

    <check-indicator></check-indicator>
    <check-box v-model="checked">check box</check-box>

    <loader :component="comp" :properties="{ label: 'hello loader!' }"></loader>

    <check-box-group v-model="checkedGroup">
      <check-box value="A">Option A</check-box>
      <check-box value="B">Option B</check-box>
    </check-box-group>

    <busy-indicator></busy-indicator>

    <radio-button>radio</radio-button>
    <radio-indicator></radio-indicator>

    <switch-indicator checked disabled></switch-indicator>
    <x-switch>xx</x-switch>

    <avatar>avatar</avatar>

    <progress-circular v-model="value"></progress-circular>

    <progress-indicator :value="value"></progress-indicator>
    <delay-button></delay-button>

    checked: {{checked}} <br/>
    checkedGroup: {{checkedGroup}} <br/>
  </application-window>
</template>

<script lang="ts">
import Vue from 'vue';
import { ApplicationWindow } from './components/application-window';
import { AbstractButton, Button } from './components/button';
import { CheckBox, CheckIndicator, CheckBoxGroup } from './components/check-box';
import { RadioButton, RadioIndicator } from './components/radio-button';
import { Switch, SwitchIndicator } from './components/switch';
import { Avatar } from './components/avatar';
import { Loader } from './components/loader';
import { BusyIndicator } from './components/busy-indicator';
import { SvgIcon } from '@/components/icon';
import { ProgressIndicator, DelayButton } from './components/delay-button';
import { ProgressBar, ProgressCircular } from './components/progress';

export default Vue.extend({
  name : 'app',

  components : {
    ApplicationWindow,
    AbstractButton,
    Button,
    CheckBox,
    CheckIndicator,
    CheckBoxGroup,
    RadioButton,
    RadioIndicator,
    SwitchIndicator,
    XSwitch : Switch,
    Loader,
    BusyIndicator,
    ProgressCircular,
    ProgressIndicator,
    DelayButton,
    Avatar,
  },

  data() {
    const list = [];
    list.length = 500000;
    for (let index = 0; index < list.length; index++) {
      list[index] = { text: index, index };
    }

    return {
      menus : [
        // { title: 'File' },
        // { title: 'Edit' },
        // { title: 'View' },
        // { title: 'Help' },
      ],
      list : Object.freeze(list),

      progress : 30,

      checkState : 3,

      radio : '1',

      value : 10,

      rangeValue : [0, 20],

      switchValue : false,

      badgeVisible : false,

      text : '3d_rotation',

      checked      : false,
      checkedGroup : ['A', 'B'],

      comp : Button,
    };
  },

  watch : {
    checkedGroup(val) {
      console.log(val);
    },
  },

  methods : {
    setBadgeVisible() {
      console.log('?//');
    },

    onClicked() {
      console.log('clicked');
    },
  },

  created() {
    setTimeout(() => {
      this.checked = !this.checked;
      this.value = 90;
    }, 3000);
  },
});
</script>

<style lang="scss">

.application-window {
  height: 100%;
}

.loading {
  width: 300px;
  height: 100px;
  margin: auto;
  .busy-indicator {
    color: #10c29b;
  }
  .loading-text {
    color: #666666;
    font-size: 14px;
    margin-top: 8px;
  }
}

.progress-bar__container {
  width: 100%;

  .item {
    margin: 20px 0;
    height: 8px;
  }

  .item--indeterminate {
    margin: 10px 0;
    height: 4px;
  }
}
.slide-item {
  margin: 90px;
}
.group {
  margin: 50px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .value {
    display: inline-block;
    margin-left: 8px;
    font-size: 14px;
    color: #999;
    font-style: initial;
  }
}
.view {
  width: 100%;
  height: 600px;
  background-color: rgba($color: #000000, $alpha: 0.2);
  padding: 20px 0;
  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }
}
</style>
