<script lang="ts">
import Vue, { VNode } from 'vue';
import FontIcon from './FontIcon.vue';
import SvgIcon from '@/components/icon/SvgIcon.vue';

export default Vue.extend({
  name : 'Icon',

  functional : true,

  render(h, { data, children }): VNode {
    const hasSource = data.attrs && 'source' in data.attrs;
    if (hasSource) {
      return h(SvgIcon, data, children);
    }
    return h(FontIcon, data, children);
  },
});
</script>

<style>
</style>
