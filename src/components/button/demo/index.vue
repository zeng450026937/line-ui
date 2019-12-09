<template>
  <div class="demo">
    <div class="demo__item">
      <p class="item__title">基础用法</p>
      <div class="item__content">
        <line-button>默认按钮</line-button>
        <line-button type="primary">主要按钮</line-button>
        <line-button type="success">成功按钮</line-button>
        <line-button type="warning">
          警告按钮
        </line-button>
        <line-button type="danger">错误按钮</line-button>
        <line-button type="light">
          浅色按钮
        </line-button>
        <line-button type="dark">深色按钮</line-button>
        <line-button type="primary"
                     round>圆角按钮</line-button>
        <line-button type="danger"
                     round>
          圆角按钮
        </line-button>
      </div>
      <div class="item__content">
        <line-button type="success"
                     circle>
          <line-icon name="backup"></line-icon>
        </line-button>
        <line-button type="warning"
                     circle>
          <line-icon name="android"></line-icon>
        </line-button>
        <line-button type="danger"
                     circle>
          <line-icon name="alarm"></line-icon>
        </line-button>
      </div>
    </div>
    <div class="demo__item">
      <div class="item__title">
        图标按钮
      </div>
      <div class="item__content">
        <line-button>
          默认按钮
          <line-icon name="android"></line-icon>
        </line-button>

        <line-button type="primary">
          <line-icon name="backup"></line-icon>
          主要按钮
        </line-button>
        <line-button type="danger"
                     round>
          <line-icon name="alarm"></line-icon>
          错误按钮
        </line-button>
        <line-button type="success"
                     circle>
          <line-icon name="adb"></line-icon>
        </line-button>
      </div>
    </div>
    <div class="demo__item">
      <div class="item__title">
        按钮大小
      </div>
    </div>
    <div class="demo__item">
      <div class="item__title">
        禁用按钮
      </div>
      <div class="item__content">
        <line-button disabled>默认按钮</line-button>
        <line-button type="success"
                     round
                     disabled>成功按钮</line-button>
        <line-button type="warning"
                     circle
                     disabled>
          <line-icon name="alarm"></line-icon>
        </line-button>
      </div>
    </div>
    <div class="demo__item">
      <div class="item__title">
        按钮组
      </div>
      <div class="item__content">
        <line-button-group>
          <line-button type="primary">主要按钮</line-button>
          <line-button type="primary">主要按钮</line-button>
        </line-button-group>
        <line-button-group>
          <line-button type="danger"
                       round>错误按钮</line-button>
          <line-button type="danger"
                       round>错误按钮</line-button>
        </line-button-group>
        <line-button-group>
          <line-button type="success"
                       round>成功按钮</line-button>
          <line-button type="warning"
                       circle>
            <line-icon name="alarm"></line-icon>
          </line-button>
          <line-button type="danger"
                       disabled>错误按钮</line-button>
        </line-button-group>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script>
import { Button as LineButton, ButtonGroup as LineButtonGroup } from '@/components/button';
import { Icon as LineIcon } from '@/components/icon';

export default {
  name : 'ButtonDemo',

  components : {
    LineButtonGroup,
    LineButton,
    LineIcon,
  },

  props : {

  },

  data() {
    return {

    };
  },

  computed : {

  },

  created() {

  },

  mounted() {

  },

  methods : {

  },

  watch : {

  },
};
</script>

<style lang="scss">
.demo {
  padding: 0 20px;

  .demo__item {
    display: flex;

    flex-direction: column;
    // justify-content: space-between;
  }
  &__item .item__title {
    padding: 0 5px;

    color: #666666;
  }
  &__item .item__content {
    display: flex;

    flex-wrap: wrap;
    justify-content: space-between;

    margin-top: 10px;
  }
}

.demo__item + .demo__item {
  margin-top: 40px;
}

.line-button {
  margin: 4px;
  i {
    margin: 0 8px;
  }
}
.line-button--circle {
  i {
    margin: 0;
  }
}
.line-button-group {
  margin-top: 4px;
}
</style>
