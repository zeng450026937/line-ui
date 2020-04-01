<template>
  <line-app>
    <line-header>
      <line-toolbar>
        <template #start>
          <line-button size="small">ICONS EXPLORER</line-button>
        </template>
        <template #default>
          <div class="input-area">
            <line-input clear-input auto-focus placeholder="search" v-model="keyword"></line-input>
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
              <line-card-subtitle>{{ sprite.name }} ( {{ sprite.matched }} / {{ sprite.total }} )</line-card-subtitle>
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
    const icons = require.context('@skyline/icons-explorer/public/', true, /.json$/);
    const iconsprites: Sprite[] = icons.keys().map(key => icons(key));

    Object.freeze(iconsprites);

    return {
      iconsprites,
      keyword : '',
      max     : 20,
    };
  },

  computed : {
    results() {
      const { iconsprites, keyword, max } = this;
      return iconsprites.map((sprite: Sprite) => {
        const { name, symbols } = sprite;
        const hasKeyword = !!keyword;
        const matched = hasKeyword ? symbols.filter(s => new RegExp(keyword, 'i').test(s.id)) : symbols.slice();
        const count = matched.length;
        const overhead = count > max;
        matched.length = overhead ? max : count;
        return {
          name,
          symbols : matched,
          matched : matched.length,
          total   : symbols.length,
        };
      });
    },
  },

  methods : {
    getSource(name: string) {
      return `/${ name }.svg`;
    },
  },
});
</script>

<style lang="scss">
.skeleton {
  border: 1px solid #1a1a1a;
}

.input-area {
  margin: 0 16px;

  padding: 0 16px;

  transition: box-shadow 250ms ease-out;

  border-radius: 64px;

  background-color: #f4f4f4;

  &:focus-within {
    border: 1px solid #e4e4e4;

    box-shadow: 0 4px 16px -8px rgba(0, 0, 0, 0.12);
  }

  > .line-input {
    --padding-top: 4px;
    --padding-bottom: 4px;
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
    border: 2px solid #4177f6;
    border-radius: 2px;
  }
}
</style>
