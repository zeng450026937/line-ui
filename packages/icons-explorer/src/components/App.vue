<template>
  <line-app>
    <line-header>
      <line-toolbar style="padding: 12px;">
        <template #start>
          <line-button size="small">ICONS EXPLORER</line-button>
        </template>
        <template #default>
          <div class="input-area">
            <line-input
              clear-input
              auto-focus
              placeholder="Search icons..."
              v-model="keyword"
            ></line-input>
          </div>
        </template>
        <template #end>
          <line-button size="small">GITHUB</line-button>
        </template>
      </line-toolbar>
    </line-header>

    <line-content>
      <template #default>
        <template v-for="sprite in results">
          <line-card v-if="sprite.symbols.length" :key="sprite.name">
            <line-card-header>
              <line-card-subtitle>
                {{ sprite.name }} ( {{ sprite.matched }} / {{ sprite.total }} )
              </line-card-subtitle>
              <div class="icon-more">
                <line-button size="small" fill="clear">More</line-button>
              </div>
            </line-card-header>
            <line-card-content>
              <div class="icon-area">
                <template v-for="(symbol, index) in sprite.symbols">
                  <div :key="index" :title="symbol.id" class="icon-symbol">
                    <line-svg-icon
                      :src="getSource(sprite.name)"
                      :name="symbol.id"
                      size="large"
                      color="dark"
                    ></line-svg-icon>
                    <div class="label">{{ symbol.id }}</div>
                  </div>
                </template>
              </div>
            </line-card-content>
          </line-card>
        </template>
      </template>
    </line-content>
  </line-app>
</template>

<script lang="ts">
import Vue from 'vue';

type Sprite = {
  name: string;
  symbols: SpriteSymbol[];
};
type SpriteSymbol = {
  id: string;
  width: number;
  height: number;
};

export default Vue.extend({
  data() {
    const icons = require.context(
      '@line-ui/icons-explorer/public/',
      true,
      /.json$/
    );
    const iconsprites: Sprite[] = icons.keys().map((key) => icons(key));

    Object.freeze(iconsprites);

    return {
      iconsprites,
      keyword: '',
      max: 20,
    };
  },

  computed: {
    results() {
      const { iconsprites, keyword, max } = this;
      return iconsprites.map((sprite: Sprite) => {
        const { name, symbols } = sprite;
        const hasKeyword = !!keyword;
        const matched = hasKeyword
          ? symbols.filter((s) => new RegExp(keyword, 'i').test(s.id))
          : symbols.slice();
        const count = matched.length;
        const overhead = count > max;
        matched.length = overhead ? max : count;
        return {
          name,
          symbols: matched,
          matched: matched.length,
          total: symbols.length,
        };
      });
    },
  },

  methods: {
    getSource(name: string) {
      return `/${name}.svg`;
    },
  },
});
</script>

<style lang="scss">
.skeleton {
  border: 1px solid #1a1a1a;
}

.input-area {
  height: 40px;

  margin: 0 30px;

  padding: 0 16px;

  transition: box-shadow 250ms ease-out;

  border-radius: 6px;

  background-color: #f4f4f4;

  &:focus-within {
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.08);
  }

  > .line-input {
    --padding-top: 10px;
    --padding-bottom: 10px;
    --background: #f6f7f9;
  }
}

.icon-area {
  display: flex;

  flex-direction: row;
  flex-wrap: wrap;
}

.icon-more {
  position: absolute;
  top: 20px;
  right: 20px;
}

.icon-symbol {
  display: flex;

  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 90px;
  height: 90px;

  margin: 8px;

  cursor: pointer;

  > .label {
    width: 100%;

    color: rgba(0, 0, 0, 0.6);

    font-size: 12px;

    text-align: center;
    text-overflow: ellipsis;

    white-space: nowrap;

    overflow: hidden;
  }

  &:hover {
    // border: 2px solid #4177f6;
    border-radius: 8px;

    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.08);
  }
}
</style>
