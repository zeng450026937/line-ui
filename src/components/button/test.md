

### 基础用法
```html
  <line-button>默认按钮</line-button>
  <line-button type="primary">主要按钮</line-button>
  <line-button type="success">成功按钮</line-button>
  <line-button type="warning">警告按钮</line-button>
  <line-button type="danger">错误按钮</line-button>
  <line-button type="light">浅色按钮</line-button>
  <line-button type="dark">深色按钮</line-button>
  <line-button type="primary" round>圆角按钮</line-button>
  <line-button type="danger" round>圆角按钮</line-button>
  <line-button type="success" circle>
    <line-icon name="backup"></line-icon>
  </line-button>
  <line-button type="warning" circle>
    <line-icon name="android"></line-icon>
  </line-button>
  <line-button type="danger" circle>
    <line-icon name="alarm"></line-icon>
  </line-button>

```

### 图标按钮
```html
  <line-button>
    默认按钮
    <line-icon name="android"></line-icon>
  </line-button>

  <line-button type="primary">
    <line-icon name="backup"></line-icon>
    主要按钮
  </line-button>
  <line-button type="danger" round>
    <line-icon name="alarm"></line-icon>
    错误按钮
  </line-button>
  <line-button type="success" circle>
    <line-icon name="adb"></line-icon>
  </line-button>

```

### 按钮大小
```html

```

### 禁用按钮
```html
  <line-button disabled>默认按钮</line-button>
  <line-button type="success" round disabled>成功按钮</line-button>
  <line-button type="warning" circle disabled>
    <line-icon name="alarm"></line-icon>
  </line-button>

```

### 按钮组
```html
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

```
