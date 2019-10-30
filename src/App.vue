<template>
  <application-window title="application-window">
    <template v-slot:menubar>
      <menu-bar v-bind:menus="menus">
      </menu-bar>
    </template>

    <template v-slot:header>
      <div>header</div>
    </template>

    <!-- <div>
      <list-view :model="list">
        <template v-slot:delegate="item">
          <lifecycle-logger style="height: 50px;"
              :label="item.index">item key: {{item.index}}</lifecycle-logger>
          <div style="height: 50px;">item key: {{item.index}}</div>
        </template>
      </list-view>
    </div> -->

    <div class="loading">
      <busy-indicator :running="true"></busy-indicator>
      <div class="loading-text">
        加载中...
      </div>
    </div>

    <div class="progress-bar__container">
      <progress-bar class="item--indeterminate"
                    indeterminate
                    :value="progress"></progress-bar>
      <progress-bar class="item--indeterminate"
                    indeterminate
                    color="#ff0000"
                    :value="progress"></progress-bar>
      <progress-bar class="item--indeterminate"
                    indeterminate
                    color="#0ff0ff"
                    :value="progress"></progress-bar>

      <progress-bar class="item"
                    :value="progress"></progress-bar>

      <progress-bar class="item"
                    color="#ff0000"
                    :value="progress"></progress-bar>

      <progress-bar class="item"
                    color="#0ff0ff"
                    :value="progress"></progress-bar>

    </div>

    <div class="group">
      <progress-bar-circular :value="progress"></progress-bar-circular>
      <progress-bar-circular :value="progress"
                             color="#ff0000"></progress-bar-circular>
      <progress-bar-circular :value="progress"
                             color="#0ff0ff"></progress-bar-circular>
      <span class="value">
        checkState -> {{progress}}
      </span>
    </div>
    <div class="group">
      <button @click="progress = progress - 10 <= 0 ? 0 : progress - 10 ">-</button>
      <button @click="progress = progress + 10 >= 100 ? 100 : progress + 10">+</button>
    </div>

    <div class="group">
      <check-box v-model="checkState">checkbox</check-box>
      <span class="value">
        checkState -> {{checkState}}
      </span>
    </div>
    <div class="slide-item">
      <slider v-model="value"></slider>
    </div>
    <div class="group">
      <span class="value">
        value -> {{value}}
      </span>
    </div>
    <div class="slide-item">
      <slider :orientation="1"
              height="300px"
              v-model="value"></slider>
    </div>
    <div class="slide-item">
      <slider v-model="value"
              :stepSize="10"></slider>
    </div>
    <div class="group">
      <span class="value">
        value -> {{value}}
      </span>
    </div>
    <div class="slide-item">
      <slider v-model="value"
              :orientation="1"
              :stepSize="10"
              height="300px"></slider>
    </div>

    <div class="slide-item">
      <range-slider v-model="rangeValue"></range-slider>
    </div>
    <div class="group">
      <span class="value">
        rangeValue -> {{rangeValue}}
      </span>
    </div>
    <div class="slide-item">
      <range-slider v-model="rangeValue"
                    :orientation="1"
                    height="300px"></range-slider>
    </div>

    <div class="slide-item">
      <range-slider v-model="rangeValue"
                    :stepSize="10"></range-slider>
    </div>
    <div class="group">
      <span class="value">
        rangeValue -> {{rangeValue}}
      </span>
    </div>
    <div class="slide-item">
      <range-slider v-model="rangeValue"
                    :orientation="1"
                    :stepSize="10"
                    height="300px"></range-slider>
    </div>

    <div class="group">
      <radio-button label="0"
                    border>RadioButton-0</radio-button>
    </div>
    <div class="group">
      <radio-button-group v-model="radio">
        <radio-button value="1">RadioButton-1</radio-button>
        <radio-button value="2">RadioButton-2</radio-button>
        <radio-button value="3"
                      disabled>RadioButton-3</radio-button>
      </radio-button-group>

      <span class="value">
        radio-value -> {{radio}}
      </span>
    </div>

    <div class="group">
      <z-switch v-model="switchValue"></z-switch>
      <span class="value">
        {{switchValue}}
      </span>
    </div>

    <div class="view">
      <swiper>
        <swipe-view>
          Slide 1
        </swipe-view>
        <swipe-view>
          Slide 2
        </swipe-view>
        <swipe-view>
          Slide 3
        </swipe-view>
      </swiper>
    </div>

    <div class="group">
      <chip>Default</chip>
      <chip>Primary</chip>
      <chip border>Primary</chip>
    </div>

    <div class="group">
      <z-button>
        button
      </z-button>
    </div>

    <div class="group">
      <badge :value="10">
        <z-button>
          button
        </z-button>
      </badge>
      <badge :value="10"
             :visible="false">
        <z-button>
          button
        </z-button>
      </badge>
      <badge :value="10"
             :visible="badgeVisible"
             @click="setBadgeVisible">
        <z-button @click="badgeVisible = !badgeVisible">
          button
        </z-button>
      </badge>
      <!-- @mouseover="show = true"
          @mouseout="show = false" -->
      <badge :value="99">
        <z-button>
          button
        </z-button>
      </badge>
      <badge :value="999">
        <z-button>
          button
        </z-button>
      </badge>
    </div>

    <template v-slot:footer>
      <div>footer</div>

    </template>

  </application-window>
</template>

<script lang="ts">
import Vue from 'vue';
import { ApplicationWindow } from './components/application-window';
import { MenuBar } from './components/menu-bar';
// import { ListView } from './components/list-view';
// import { LifecycleLogger } from './components/functional';
import { BusyIndicator } from './components/busy-indicator';
import { ProgressBar, ProgressBarCircular } from './components/progress-bar';
import { CheckBox } from './components/check-box';
import { RadioButton } from './components/radio-button';
import { Slider } from './components/slider';
import { RangeSlider } from './components/range-slider';
import { RadioButtonGroup } from './components/radio-button-group';
import { Switch as ZSwitch } from './components/switch';
import { Swiper } from './components/swiper';
import { SwipeView } from './components/swipe-view';
import { Chip } from './components/chip';
import { Button as ZButton } from './components/button';
import { Badge } from './components/badge';

export default Vue.extend({
  name: 'app',

  components: {
    ApplicationWindow,
    MenuBar,
    // ListView,
    // LifecycleLogger,
    BusyIndicator,
    ProgressBar,
    ProgressBarCircular,
    CheckBox,
    RadioButton,
    Slider,
    RangeSlider,
    RadioButtonGroup,
    ZSwitch,
    Swiper,
    SwipeView,
    Chip,
    ZButton,
    Badge,
  },

  data() {
    const list = [];
    list.length = 500000;
    for (let index = 0; index < list.length; index++) {
      list[index] = { text: index, index };
    }

    return {
      menus: [
        // { title: 'File' },
        // { title: 'Edit' },
        // { title: 'View' },
        // { title: 'Help' },
      ],
      list: Object.freeze(list),

      progress: 30,

      checkState: 3,

      radio: '1',

      value: 10,

      rangeValue: [0, 20],

      switchValue: false,

      badgeVisible: false,
    };
  },

  methods: {
    setBadgeVisible() {
      console.log('?//');
    },
  },
});
</script>

<style lang="scss">
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
