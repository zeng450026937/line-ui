<template>
  <line-app>
    <line-content>
      <line-button>
        {{ msg }}
      </line-button>
      <line-button>
        {{ msg }}
      </line-button>
    </line-content>
  </line-app>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Click Me',
    };
  },
};
</script>
