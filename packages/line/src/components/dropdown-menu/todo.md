# dropdown-menu

- useTrigger()的用途理解错了

```vue
// 下述几种用法应该可以是可以用的

<template>

<button id="triggerId" ref="triggerRef"></button>

// 不推荐用法
<dropdown trigger="#triggerId"></dropdown>

// 推荐用法
<dropdown trigger="triggerRef"></dropdown>

// 不太推荐的用法
<dropdown :trigger="trig"></dropdown>

// 不太推荐的用法
<dropdown :trigger="trigRef"></dropdown>

</template>

<script>

const trig = document.querySelector('#triggerId')
const trigRef = this.$refs.triggerRef

// 组件内获取triggerEl推荐使用组件的 $triggerEl 属性（computed）
// 受限于refs的解析原理，$triggerEl不应在早于mounted的生命周期里使用
</script>
```
