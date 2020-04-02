# Issues

- Release脚本和NPM发布

- Popup类组件应该是基于App范围内，而不是body

- props声明应该尽可能简短，所有的default应该都可以去掉，以优化最后编译的大小

- 所有的usage(示例)都应该使用v-slot，非作用插槽是不推荐的写法

- 组件内的插槽内容统一使用slots()获取，对于拥有多个插槽，并且某个插槽可能因为属性频繁变化导致刷新 或者 插槽内容可能会很复杂时，应该适当对插槽内容进行缓存，采用computed是一个不错的方法

- 在书写函数式组件时，需要注意class/style的传递。原则上不推荐编写函数式组件
- 在书写状态组件时，需要注意顶层$listeners的传递

- 如果可以，代码中使用到 tag/lifecycle 名应该有统一的地方定义，以优化最后编译的大小

- 鉴于当前指令的实现机制（在el上挂在对应的指令名称变量），在组件的根节点上直接使用指令可能会与用户的指令存在冲突，需要考虑使用 createDirective() 的方式代理指令，虽然一定程度上会增加代码的维护成本，优先级较低

- 更容易让压缩插件优化的代码

```js
if (this.item) {
  ...
}
func(this.item)
```

=>

```js
const { item } = this
if (item) {
  ...
}
func(item)
```

- tsx使用外部组件时，无需注册到components，大写的组件名即可
- swiper.js目前不支持tree-shaking，需要额外处理
