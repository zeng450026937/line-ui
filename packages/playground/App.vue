<template>
  <line-app>
    <div class="app-content">
      <!-- <div id="app"> -->
      <!-- <line-overlay :visable="false"></line-overlay> -->
      <!-- <line-popup dim :value="false">popup</line-popup> -->
      <!-- <application-window title="application-window"> -->
      <!-- <template v-slot:menubar> -->
      <!-- <menu-bar v-bind:menus="menus">
      </menu-bar> -->
      <!-- </template> -->

      <!-- <template v-slot:header> -->
      <!-- <div>header</div> -->
      <!-- </template> -->

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
        <progress-bar
          class="item--indeterminate"
          indeterminate
          :value="progress"
        ></progress-bar>
        <progress-bar
          class="item--indeterminate"
          indeterminate
          color="#ff0000"
          :value="progress"
        ></progress-bar>
        <progress-bar
          class="item--indeterminate"
          indeterminate
          color="#0ff0ff"
          :value="progress"
        ></progress-bar>

        <progress-bar
          class="item"
          :value="progress"
        ></progress-bar>

        <progress-bar
          class="item"
          color="#ff0000"
          :value="progress"
        ></progress-bar>

        <progress-bar
          class="item"
          color="#0ff0ff"
          :value="progress"
        ></progress-bar>

      </div>

      <div class="group">
        <progress-circular :value="progress"></progress-circular>
        <progress-circular
          :value="progress"
          color="#ff0000"
        ></progress-circular>
        <progress-circular
          :value="progress"
          color="#0ff0ff"
        ></progress-circular>
        <span class="value">
          check -> {{progress}}
        </span>
      </div>
      <div class="group">
        <button @click="progress = progress - 10 <= 0 ? 0 : progress - 10 ">-</button>
        <button @click="progress = progress + 10 >= 100 ? 100 : progress + 10">+</button>
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
        <slider
          :orientation="1"
          height="300px"
          v-model="value"
        ></slider>
      </div>
      <div class="slide-item">
        <slider
          v-model="value"
          :stepSize="10"
        ></slider>
      </div>
      <div class="group">
        <span class="value">
          value -> {{value}}
        </span>
      </div>
      <div class="slide-item">
        <slider
          v-model="value"
          :orientation="1"
          :stepSize="10"
          height="300px"
        ></slider>
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
        <range-slider
          v-model="rangeValue"
          :orientation="1"
          height="300px"
        ></range-slider>
      </div>

      <div class="slide-item">
        <range-slider
          v-model="rangeValue"
          :stepSize="10"
        ></range-slider>
      </div>
      <div class="group">
        <span class="value">
          rangeValue -> {{rangeValue}}
        </span>
      </div>
      <div class="slide-item">
        <range-slider
          v-model="rangeValue"
          :orientation="1"
          :stepSize="10"
          height="300px"
        ></range-slider>
      </div>

      <div class="group">
        <radio-button
          label="0"
          border
        >RadioButton-0</radio-button>
      </div>
      <div class="group">
        <radio-button-group v-model="radio">
          <radio-button modelValue="1">RadioButton-1</radio-button>
          <radio-button modelValue="2">RadioButton-2</radio-button>
          <radio-button
            modelValue="3"
            disabled
          >RadioButton-3</radio-button>
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
        <line-chip color="">Default</line-chip>
        <line-chip border>border</line-chip>
      </div>
      <div class="group">
        <line-chip color="primary">primary</line-chip>
        <line-chip color="success">success</line-chip>
        <line-chip color="warning">warning</line-chip>
        <line-chip color="danger">danger</line-chip>
        <line-chip color="light">light</line-chip>
        <line-chip color="dark">dark</line-chip>
      </div>
      <div class="group">
        <line-chip
          color="primary"
          border
        >primary</line-chip>
        <line-chip
          color="success"
          border
        >success</line-chip>
        <line-chip
          color="warning"
          border
        >warning</line-chip>
        <line-chip
          color="danger"
          border
        >danger</line-chip>
        <line-chip
          color="light"
          border
        >light</line-chip>
        <line-chip
          color="dark"
          border
        >dark</line-chip>
      </div>
      <div class="group">
        <line-chip
          color="primary"
          border
          close-icon="3d_rotation"
          @close="onClose"
        >primary</line-chip>
        <line-chip
          color="success"
          border
          close-icon="annotation_help"
        >success</line-chip>
        <line-chip
          color="warning"
          border
          close-icon="alarm"
        >warning</line-chip>
        <line-chip
          color="danger"
          border
          close-icon="clear"
        >danger</line-chip>
        <line-chip
          color="light"
          border
          close-icon="backspace"
        >light</line-chip>
        <line-chip
          color="dark"
          border
          close-icon="keyboard_arrow_left"
        >dark</line-chip>
      </div>
      <div class="group">
        <line-chip
          color="primary"
          border
          close-icon="member_list_raise_hands"
        >
          <line-font-icon
            name="im_private_chat"
            :height="16"
          ></line-font-icon>
          primary
        </line-chip>
        <line-chip
          color="success"
          border
          close-icon="annotation_help"
        >
          <line-font-icon
            name="contacts_gender_male"
            :height="16"
          ></line-font-icon>
          success
        </line-chip>
        <line-chip
          color="warning"
          border
          close-icon="refresh"
        >warning</line-chip>
        <line-chip
          color="danger"
          border
          close-icon="cancel"
        >danger</line-chip>
        <line-chip
          color="light"
          border
          close-icon="check"
        >light</line-chip>
        <line-chip
          color="dark"
          border
          close-icon="schedule_periodic"
        >dark</line-chip>
      </div>
      <div class="group">
        <line-button>
          button
        </line-button>
      </div>

      <div class="group">
        <badge :value="10">
          <line-button>
            button
          </line-button>
        </badge>
        <badge
          :value="10"
          :visible="false"
        >
          <line-button>
            button
          </line-button>
        </badge>
        <badge
          :value="10"
          :visible="badgeVisible"
          @click="setBadgeVisible"
        >
          <line-button @click="badgeVisible = !badgeVisible">
            button
          </line-button>
        </badge>
        <badge :value="99">
          <line-button>
            button
          </line-button>
        </badge>
        <badge :value="999">
          <line-button>
            button
          </line-button>
        </badge>

      </div>
      <div class="group">
        <badge
          :value="10"
          color="primary"
        >
          <line-button>
            button
          </line-button>
        </badge>
        <badge
          :value="10"
          color="success"
        >
          <line-button>
            button
          </line-button>
        </badge>
        <badge
          :value="99"
          color="warning"
        >
          <line-button>
            button
          </line-button>
        </badge>
        <badge
          :value="999"
          color="danger"
        >
          <line-button>
            button
          </line-button>
        </badge>
      </div>
      <div class="group">
        <badge
          :value="20"
          color="light"
        >
          <line-button>
            button
          </line-button>
        </badge>
        <badge
          :value="2"
          color="dark"
        >
          <line-button>
            button
          </line-button>
        </badge>
        <badge
          :value="30"
          color="#006adf"
        >
          <line-button>
            button
          </line-button>
        </badge>
        <badge
          :value="30"
          color="asd"
        >
          <line-button>
            button
          </line-button>
        </badge>
      </div>
      <div class="group">
        <badge
          dot
          color="primary"
        >
          <line-button>
            button
          </line-button>
        </badge>
        <badge
          dot
          color="success"
        >
          <line-button>
            button
          </line-button>
        </badge>
        <badge
          dot
          color="warning"
        >
          <line-button>
            button
          </line-button>
        </badge>
        <badge
          dot
          color="danger"
        >
          <line-button>
            button
          </line-button>
        </badge>
      </div>

      <div class="group">
        <check-box-group v-model="checkGroup">
          <check-box
            v-model="check0"
            modelValue="0"
          >check0</check-box>
          <check-box
            v-model="check1"
            modelValue="1"
          >check1</check-box>
          <check-box
            v-model="check2"
            modelValue="2"
          >check2</check-box>
        </check-box-group>
        <span class="value">
          <p>
            checkGroup -> {{checkGroup}}
          </p>
          <p>
            check0 -> {{check0}}
          </p>
          <p>
            check1 -> {{check1}}
          </p>
          <p>
            check2 -> {{check2}}
          </p>
        </span>
      </div>

      <div class="group">
        <check-box-group v-model="checkGroup2">
          <check-box
            v-model="check3"
            modelValue="3"
          >check3</check-box>
          <check-box
            v-model="check4"
            modelValue="4"
          >check4</check-box>
          <check-box
            v-model="check5"
            modelValue="5"
          >check5</check-box>
          <check-box
            v-model="check5"
            modelValue="5"
            disabled
          >check5</check-box>
        </check-box-group>
        <span class="value">
          <p>
            checkGroup2 -> {{checkGroup2}}
          </p>
          <p>
            check3 -> {{check3}}
          </p>
          <p>
            check4 -> {{check4}}
          </p>
          <p>
            check5 -> {{check5}}
          </p>
        </span>
      </div>

      <div class="group">
        <check-box v-model="check3">checkbox3</check-box>
        <check-box v-model="check4">checkbox4</check-box>
        <check-box
          v-model="check4"
          disabled
        >checkbox4</check-box>
        <check-box
          v-model="check5"
          disabled
        >checkbox5</check-box>
        <span class="value">
          <p>
            check3 -> {{check3}}
          </p>
          <p>
            check4 -> {{check4}}
          </p>
          <p>
            check5 -> {{check5}}
          </p>
        </span>
      </div>

      <div class="group">
        <!-- <popup :visable="visable"
             global></popup>
      <line-button @click="visable = !visable">button</line-button> -->
      </div>
      <div class="group">
        <popover v-model="popoverVisable">
          <template v-slot:default="{ present, dismiss }">
            <line-button @click="present">button1</line-button>
          </template>
        </popover>
      </div>

      <div class="group">
        <tool-tip text="button1aaaaaaaaaaaaaaaaaaaaaatop">
          <line-button>button1</line-button>
        </tool-tip>
        <tool-tip
          placement="left"
          text="button2 - left"
        >
          <line-button>button2</line-button>
        </tool-tip>
        <tool-tip
          placement="bottom"
          text="button3 - bottom"
        >
          <line-button>button3</line-button>
        </tool-tip>
        <tool-tip
          placement="right"
          text="button4 - right"
        >
          <line-button>button4</line-button>
        </tool-tip>
      </div>

      <!-- <div class="group">
      <Select v-model="selectValue">
        <select-option v-for="(item, index) in 5"
                       :key="index"
                       :label="`select-option ${index}`"
                       :value="index">
        </select-option>
      </Select>
    </div>

    <div class="group">
      <Select v-model="selectValue">
        <select-option v-for="(item, index) in 5"
                       :key="index"
                       :label="`select-option ${index}`"
                       :value="index">
          <template v-slot:default="{value, label}">
            slot: {{ value }} -> {{ label }}
          </template>
        </select-option>
      </Select>
    </div> -->

      <div class="group">
        <progress-bar
          :value="bufferProgress"
          :buffer-value="bufferProgress + 10"
        ></progress-bar>

      </div>
      <div class="group">
        <progress-bar
          :value="bufferProgress"
          :buffer-value="bufferProgress + 10"
          stream
        ></progress-bar>
      </div>
      <div class="group">
        <button @click="bufferProgress = bufferProgress - 10 <= 0 ? 0 : bufferProgress - 10 ">
          -
        </button>
        <button @click="bufferProgress = bufferProgress + 10 >= 100 ? 100 : bufferProgress + 10">
          +
        </button>
      </div>

      <!-- <div class="group">
      <action-sheet v-model="actionSheetVisable">
        <div class="group">
          <p>The basic usage of v-bottom-sheet.
            Almost any content can be placed inside this component</p>
          <line-button @click="actionSheetVisable = !actionSheetVisable">button</line-button>
        </div>
      </action-sheet>
    </div>
    <div class="group">
      <line-button @click="actionSheetVisable = !actionSheetVisable">button</line-button>
    </div> -->

      <div class="group">
        <collapse v-model="collapseValue">
          <collapse-item
            title="CollapseItem - 1"
            modelValue="1"
          >
            CollapseItem - CollapseItem 1
          </collapse-item>
          <collapse-item
            title="CollapseItem - 2"
            modelValue="2"
          >
            CollapseItem - CollapseItem 2
          </collapse-item>
          <collapse-item
            title="CollapseItem - 3"
            modelValue="3"
          >
            CollapseItem - CollapseItem 3
          </collapse-item>
          <collapse-item
            title="CollapseItem - 4"
            modelValue="4"
          >
            CollapseItem - CollapseItem 4
          </collapse-item>
        </collapse>

        <span class="value">
          collapseValue -> {{collapseValue}}
        </span>
      </div>

      <div class="group">
        <collapse
          v-model="collapseValue_2"
          :exclusive="false"
        >
          <collapse-item
            title="CollapseItem - 1"
            modelValue="1"
          >
            CollapseItem - CollapseItem 1
          </collapse-item>
          <collapse-item
            title="CollapseItem - 2"
            modelValue="2"
          >
            CollapseItem - CollapseItem 2
          </collapse-item>
          <collapse-item
            title="CollapseItem - 3"
            modelValue="3"
          >
            CollapseItem - CollapseItem 3
          </collapse-item>
          <collapse-item
            title="CollapseItem - 4"
            modelValue="4"
          >
            CollapseItem - CollapseItem 4
          </collapse-item>
          <collapse-item
            title="CollapseItem - 4"
            modelValue="4"
            disabled
          >
            CollapseItem - CollapseItem 4
          </collapse-item>
        </collapse>
        <span class="value">
          collapseValue_2 -> {{collapseValue_2}}
        </span>
      </div>

      <div class="group">
        <!-- <tabs v-model="activeTab">
          <tab modelValue="item-1">
            <span slot="title">slot - tab-1</span>
            test_content-1
          </tab>
          <tab
            modelValue="item-2"
            title="tab-2"
          >
            test_content-2
          </tab>
          <tab
            modelValue="item-3"
            title="tab-2333333"
          >
            test_content-3
          </tab>
        </tabs> -->

        <span class="value">
          activeTab-> {{ activeTab }}
        </span>
      </div>

      <div class="group">
        <tab-bar v-model="tabBar">
          <tab-button
            icon="airplanemode_active"
            modelValue="1"
          >airplanemode</tab-button>
          <tab-button
            icon="bluetooth"
            modelValue="2"
          >bluetooth</tab-button>
          <tab-button
            icon="gps_fixed"
            modelValue="3"
          >gps</tab-button>
        </tab-bar>

        <span class="value">
          tabBar -> {{ tabBar }}
        </span>
      </div>

      <div class="group">
        <tab-bar v-model="tabBar_2">
          <tab-button
            icon="airplanemode_active"
            modelValue="1"
          >airplanemode</tab-button>
          <tab-button
            icon="bluetooth"
            modelValue="2"
          >bluetooth</tab-button>
          <tab-button
            icon="gps_fixed"
            modelValue="3"
          >gps</tab-button>
          <tab-button
            icon="drafts"
            modelValue="4"
            disabled
          >drafts</tab-button>
        </tab-bar>

        <span class="value">
          tabBar_2 -> {{ tabBar_2 }}
        </span>
      </div>

      <div class="group">
        <page-indicator
          v-model="indicator"
          :count="20"
          countVisible="6"
        ></page-indicator>
      </div>
      <div class="group">
        <page-indicator
          v-model="indicator"
          :count="20"
          countVisible="10"
        ></page-indicator>
      </div>
      <div class="group">
        <page-indicator
          v-model="indicator"
          :count="20"
          countVisible="20"
        ></page-indicator>
      </div>

      <!-- <div class="group">
      <Menu placement="bottom">
        <template v-slot:activator="{ present, dismiss }">
          <line-button @click="present">button</line-button>
        </template>
        <menu-item value="1">
          test
        </menu-item>
        <menu-item value="2">
          test
        </menu-item>
        <menu-item value="3">
          test
        </menu-item>
        <menu-item value="4">
          test
        </menu-item>
      </Menu>
    </div> -->

      <div class="group">

      </div>
      <!-- <div class="group">
      <Menu placement="bottom">
        <template v-slot:activator="{ present, dismiss }">
          <line-button @click="present">button</line-button>
        </template>
        <menu-item value="1">
          test
        </menu-item>
        <menu-item value="2">
          test
        </menu-item>
        <menu-item value="3">
          test
        </menu-item>
        <menu-item value="4">
          test
        </menu-item>
      </Menu>
    </div> -->
      <div class="group">
        <toast
          v-model="toastValue"
          position="middle"
        >
          testtttt
        </toast>
        <toast
          v-model="toastValue"
          message="??????????"
        >
        </toast>
        <line-button @click="toastValue = !toastValue">button</line-button>
      </div>
      <div class="group">
        <skyInput
          v-model="inputValue"
          clearable
        ></skyInput>
        <span class="value">
          inputValue -> {{inputValue}}
        </span>
      </div>

      <div class="group">
        <skyInput
          v-model="inputValue"
          prefixIcon="alarm"
          suffixIcon="clear"
        ></skyInput>
        <span class="value">
          inputValue -> {{inputValue}}
        </span>
      </div>
      <div class="group">
        <skyInput
          v-model="inputValue"
          prefixIcon="alarm"
          suffixIcon="annotation_help"
          clearable
        ></skyInput>
        <span class="value">
          inputValue -> {{inputValue}}
        </span>
      </div>

      <div class="group">
        <skyInput
          v-model="inputValue"
          type="password"
        ></skyInput>
        <span class="value">
          inputValue -> {{inputValue}}
        </span>
      </div>
      <div class="group">
        <text-area
          v-model="textValue"
          clearable
          autosize
        ></text-area>

        <span class="value">
          textValue -> {{textValue}}
        </span>
      </div>
      <div class="group">
        <text-area
          v-model="textValue"
          :rows="1"
          clearable
          autosize
        ></text-area>

        <span class="value">
          textValue -> {{textValue}}
        </span>
      </div>
      <div class="group">
        <line-button round>button</line-button>
        <line-button>button</line-button>
        <line-button
          icon="alarm"
          circle
        ></line-button>
        <line-button type="primary">button</line-button>
        <line-button>button</line-button>
      </div>
      <div class="group">
        <line-button round>button</line-button>
        <line-button>button</line-button>
        <line-button
          icon="alarm"
          circle
        ></line-button>
        <line-button
          type="primary"
          icon="alarm"
          circle
        ></line-button>
        <line-button type="success">button</line-button>
      </div>
      <div class="group">
        <line-button icon="alarm">button</line-button>
        <line-button
          type="primary"
          icon="alarm_on"
        >button</line-button>
        <line-button
          type="success"
          icon="alarm"
        >button</line-button>
        <line-button
          type="warning"
          icon="alarm"
        >button</line-button>
        <line-button
          type="danger"
          icon="android"
        >button</line-button>
        <line-button
          type="light"
          icon="backup"
        >button</line-button>
        <line-button
          type="dark"
          icon="alarm"
        >button</line-button>
      </div>
      <div class="group">
        <line-button
          icon="alarm"
          plain
        >button</line-button>
        <line-button
          type="primary"
          icon="card_giftcard"
          plain
        >button</line-button>
        <line-button
          type="success"
          icon="alarm"
          plain
        >button</line-button>
        <line-button
          type="warning"
          icon="alarm"
          plain
        >button</line-button>
        <line-button
          type="danger"
          icon="delete_outline"
          plain
        >button</line-button>
        <line-button
          type="light"
          icon="alarm"
          plain
        >button</line-button>
        <line-button
          type="dark"
          icon="alarm"
          plain
        >button</line-button>
      </div>
      <div class="group">
        <line-button
          icon="alarm"
          circle
        ></line-button>
        <line-button
          type="primary"
          icon="alarm"
          circle
        ></line-button>
        <line-button
          type="success"
          icon="donut_small"
          circle
        ></line-button>
        <line-button
          type="warning"
          icon="alarm"
          circle
        ></line-button>
        <line-button
          type="danger"
          icon="history"
          circle
        ></line-button>
        <line-button
          type="light"
          icon="lock"
          circle
        ></line-button>
        <line-button
          type="dark"
          icon="power_settings_new"
          circle
        ></line-button>
      </div>
      <div class="group">
        <line-button
          icon="alarm"
          disabled
          circle
        ></line-button>
        <line-button
          type="primary"
          icon="alarm"
          disabled
          circle
        ></line-button>
        <line-button
          type="success"
          icon="alarm"
          disabled
        >button</line-button>
        <line-button
          type="warning"
          icon="alarm"
          disabled
        >button</line-button>
        <line-button
          type="danger"
          icon="alarm"
          plain
          disabled
        >button</line-button>
        <line-button
          icon="alarm"
          type="success"
          plain
          circle
          disabled
        ></line-button>
        <line-button
          type="dark"
          icon="alarm"
          circle
          disabled
        ></line-button>
      </div>

      <div class="group">
        <line-button-group>
          <line-button
            type="danger"
            icon="alarm"
            plain
          >button</line-button>
          <line-button
            type="success"
            icon="alarm"
            disabled
          >button</line-button>
          <line-button
            icon="alarm"
            plain
          >button</line-button>
        </line-button-group>
        <line-button-group>
          <line-button
            type="primary"
            icon="alarm"
            plain
          >button</line-button>
          <line-button
            type="primary"
            icon="alarm"
            plain
          >button</line-button>
        </line-button-group>
      </div>
      <div class="group">
        <line-button-group>
          <line-button
            type="primary"
            icon="alarm"
          ></line-button>
          <line-button
            type="primary"
            icon="local_post_office"
          ></line-button>
          <line-button
            type="primary"
            icon="directions_subway"
          ></line-button>
        </line-button-group>
        <line-button-group>
          <line-button
            type="primary"
            icon="alarm"
            circle
          ></line-button>
          <line-button
            type="primary"
            icon="flight"
            circle
            disabled
          ></line-button>
          <line-button
            type="primary"
            icon="local_gas_station"
            circle
          ></line-button>
        </line-button-group>
      </div>
      <div class="group">
        <line-button-group>
          <line-button
            type="success"
            icon="alarm"
            circle
          ></line-button>
          <line-button
            type="success"
            icon="flight"
          ></line-button>
          <line-button
            type="success"
            icon="local_gas_station"
            circle
          ></line-button>
        </line-button-group>
        <line-button-group>
          <line-button
            type="warning"
            icon="alarm"
            circle
            plain
          ></line-button>
          <line-button
            type="warning"
            icon="flight"
            circle
            plain
          ></line-button>
          <line-button
            type="warning"
            icon="local_gas_station"
            plain
          ></line-button>
        </line-button-group>
      </div>
      <div class="group">
        <line-button-group>
          <line-button
            type="light"
            icon="drafts"
          ></line-button>
          <line-button>2048-5555</line-button>
        </line-button-group>
        <line-button-group>
          <line-button
            type="light"
            plain
          >test-2048</line-button>
          <line-button
            type="light"
            icon="flight"
            circle
          ></line-button>
        </line-button-group>
      </div>
      <div class="group">
        <!-- <DelayButton>asdasd</DelayButton> -->
      </div>

      <div class="group">
        <stepper v-model="stepperValue"></stepper>
        <stepper
          v-model="stepperValue_2"
          :max="10"
          :min="5"
          :step="2"
        ></stepper>

      </div>
      <div class="group">
        <stepper
          v-model="stepperValue_3"
          :step="0.5"
          :max="10"
          :min="5"
        ></stepper>
        <stepper v-model="stepperValue_4"></stepper>
      </div>
      <div class="group">
        <stepper
          v-model="stepperValue_5"
          :precision="2"
          :step="0.5"
          :max="10"
          :min="5"
        ></stepper>

      </div>
      <div class="group">
        <line-button @click="drawerVisableTop = !drawerVisableTop">button</line-button>
        <line-button @click="drawerVisableLeft = !drawerVisableLeft">button</line-button>
        <line-button @click="drawerVisableRight = !drawerVisableRight">button</line-button>
        <line-button @click="drawerVisableBottom = !drawerVisableBottom">button</line-button>
        <drawer v-model="drawerVisableTop"></drawer>
        <drawer
          v-model="drawerVisableLeft"
          :position="1"
        ></drawer>
        <drawer
          v-model="drawerVisableRight"
          :position="2"
        ></drawer>
        <drawer
          v-model="drawerVisableBottom"
          :position="3"
        ></drawer>
      </div>

      <div class="list">
        <cell
          title="cell"
          content="test-content"
          arrow
        ></cell>
        <cell
          title="cell"
          content="test-content"
          arrow
        ></cell>
        <cell
          title="cell"
          content="test-content"
        ></cell>
        <cell title="cell"></cell>
        <cell content="test-content"></cell>
      </div>

      <div class="list">
        <cell-group>
          <cell arrow>
            <span slot="title">
              title
            </span>
            <span slot="content">
              content
            </span>
          </cell>
          <cell arrow>
            <span slot="title">
              <line-font-icon
                name="contacts_gender_male"
                :height="16"
              ></line-font-icon>
              title-slot
            </span>
            <span slot="content">
              <line-font-icon
                name="im_private_chat"
                :height="16"
              ></line-font-icon>
              content-slot
            </span>
          </cell>
        </cell-group>
      </div>
      <div class="refresher-container">
        <refresher
          v-model="refresherVal"
          @refresh="onRefresh"
        >
          <cell
            title="cell"
            content="test-content"
            arrow
          ></cell>
          <cell
            title="cell"
            content="test-content"
            arrow
          ></cell>
          <cell
            title="cell"
            content="test-content"
          ></cell>
          <cell title="cell"></cell>
          <cell content="test-content"></cell>
          <cell
            title="cell"
            content="test-content"
          ></cell>
          <cell
            title="cell"
            content="test-content"
          ></cell>
          <cell
            title="cell"
            content="test-content"
          ></cell>
          <cell
            title="cell"
            content="test-content"
          ></cell>
        </refresher>
      </div>
      <!-- <template v-slot:footer>
      <div>footer</div>

    </template>

  </application-window> -->
      <!-- </div> -->
    </div>
  </line-app>
</template>

<script lang="ts">
import Vue from 'vue';

import { App } from '@/components/app';

import { Overlay } from '@/components/overlay';
import { ApplicationWindow } from '@/components/application-window';
// import { MenuBar } from '@/components/menu-bar';
// import { ListView } from '@/components/list-view';
// import { LifecycleLogger } from '@/components/functional';
import { BusyIndicator } from '@/components/busy-indicator';
import { ProgressBar, ProgressCircular } from '@/components/progress';
import { CheckBox, CheckBoxGroup } from '@/components/check-box';
import { RadioButton, RadioButtonGroup } from '@/components/radio-button';
import { Slider } from '@/components/slider';
import { RangeSlider } from '@/components/range-slider';
import { Switch as ZSwitch } from '@/components/switch';
import { Swiper } from '@/components/swiper';
import { SwipeView } from '@/components/swipe-view';
// import { Chip } from '@/components/line-chip';
// import { Button as ZButton, ButtonGroup } from '@/components/button';
import { Badge } from '@/components/badge';
// import { FontIcon } from '@/components/icon';
import { Popover } from '@/components/popover';
import { ToolTip } from '@/components/tooltip';
// import { Select } from '@/components/select';
// import { SelectOption } from '@/components/select-option';
// import { ActionSheet } from '@/components/action-sheet';
import { Collapse, CollapseItem } from '@/components/collapse';
// import { Tab, Tabs } from '@/components/tabs';
import { TabBar } from '@/components/tab-bar';
import { TabButton } from '@/components/tab-button';
import { PageIndicator } from '@/components/page-indicator';
// import { Menu, MenuItem } from '@/components/menu';
import { Toast } from '@/components/toast';
import { TextArea } from '@/components/text-area';
import { Input as skyInput } from '@/components/input';
// import { DelayButton } from '@/components/delay-button';
import { Stepper } from '@/components/stepper';
import Drawer from '@/components/drawer';
import { Cell, CellGroup } from '@/components/cell';
import { Refresher } from '@/components/refresher';

Vue.use(App);
export default Vue.extend({
  name : 'App',

  components : {
    [Overlay.name] : Overlay,
    // [Popup.name]   : Popup,
    // ApplicationWindow,
    // MenuBar,
    // ListView,
    // LifecycleLogger,
    BusyIndicator,
    ProgressBar,
    ProgressCircular,
    CheckBox,
    // CheckIndicator,
    CheckBoxGroup,
    RadioButton,
    Slider,
    RangeSlider,
    RadioButtonGroup,
    ZSwitch,
    Swiper,
    SwipeView,
    // Chip,
    // ZButton,
    // ButtonGroup,
    Badge,
    // FontIcon,
    // CheckBoxGroup,
    // Popup,
    Popover,
    ToolTip,
    // Select,
    // SelectOption,
    // ActionSheet,
    Collapse,
    CollapseItem,
    // Tabs,
    // Tab,
    TabBar,
    TabButton,
    PageIndicator,
    // Menu,
    // MenuItem,
    Toast,
    TextArea,
    skyInput,
    // DelayButton,
    Stepper,
    Drawer,
    CellGroup,
    Cell,
    Refresher,
  },

  data() {
    return {
      progress       : 30,
      bufferProgress : 20,

      check       : true,
      check0      : true,
      check1      : true,
      check2      : true,
      check3      : false,
      check4      : false,
      check5      : true,
      checkGroup  : [],
      checkGroup2 : ['3', '4', '5'],

      radio : '1',

      value : 10,

      rangeValue : [0, 20],

      switchValue : false,

      badgeVisible : false,

      visable : false,

      popoverVisable : false,

      selectValue : 1,

      // actionSheetVisable : false,

      collapseValue   : '3',
      collapseValue_2 : ['2'],

      activeTab : 'item-1',

      tabBar : '2',

      tabBar_2 : '',

      indicator : 1,

      toastValue   : false,
      inputValue   : '',
      textValue    : '',
      stepperValue : 0,

      stepperValue_2 : 5,
      stepperValue_3 : 5,
      stepperValue_4 : 5,
      stepperValue_5 : 6,

      drawerVisableTop    : false,
      drawerVisableLeft   : false,
      drawerVisableRight  : false,
      drawerVisableBottom : false,

      refresherVal : false,
    };
  },

  methods : {
    setBadgeVisible() {
      console.log('setBadgeVisible');
    },

    onClose() {
      console.log('close');
    },

    onPresent() {
      console.log('onPresent');
    },

    onClicked() {
      console.log('clicked');
    },

    onRefresh() {
      setTimeout(() => {
        this.refresherVal = false;
      }, 2000);
    },
  },
});
</script>

<style lang="scss">
#app {
  position: relative;

  height: 100%;
}

.app-content {
  display: flex;

  flex-direction: column;

    width: 100%;
    height: 100%;

    padding: 0 20px;

    overflow: auto;
}

.header {
  height: 48px;

  border-bottom: 1px solid #ebebeb;

  text-align: center;
}
.loading {
  width: 300px;
  height: 100px;

  margin: auto;
  .busy-indicator {
    color: #10c29b;
  }
  .loading-text {
    margin-top: 8px;

    color: #666666;

    font-size: 14px;
  }
}

.progress-bar__container {
  width: 100%;

  .item {
    height: 8px;

    margin: 20px 0;
  }

  .item--indeterminate {
    height: 4px;

    margin: 10px 0;
  }
}
.slide-item {
  margin: 90px;
}
.group {
  display: flex;

  align-items: center;
  justify-content: space-around;

  margin: 50px;
  .value {
    display: inline-block;

    width: 300px;

    margin-left: 8px;

    color: #999;

    font-size: 14px;
    font-style: initial;
  }
}
.list {
  width: 100%;

  padding: 20px 0;

  background-color: #f5f5f5;
}
.refresher-container {
  width: 100%;
  height: 700px;
  // margin: 40px 0;
  background-color: #f5f5f5;
}
.view {
  width: 100%;
  height: 600px;

  padding: 20px 0;

  background-color: rgba($color: #000000, $alpha: 0.2);

  .swiper-slide {
    display: flex;

    align-items: center;
    justify-content: center;

    background-color: #fff;
  }
}
</style>
