# Improvement

- 替换路劲上的@指向，如@skyline使得工程代码可以在外部工程中直接引入使用

# Issues

- ripple effect检测与activatable检测冲突，当两者属于同一个Component但不是同一个元素，即 拥有ripple effect的元素不是activatable，会造成外层元素的activatable类无法正常添加

  - Button组件
