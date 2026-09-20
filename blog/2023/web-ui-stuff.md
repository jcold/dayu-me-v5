---
id: 1698044135315
title: Web 界面设计
created_at: 2023-10-23 14:55
---

*本页目录*

[TOC]

## 组成

- [[字体]]
- [配色](小白配色)
- [图片素材](img-stuff)


## CSS换皮肤 / 深色模式

**换皮肤**通用的方法，就是less、sass、post-css，把颜色抽离出变量。然后打包输出不同的样式，或在线切换。

**深色模式**通过[window.matchMedia](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/matchMedia) 方法，实现媒体查询，解析后的结果再结合 CSS 变量，设置对应的 CSS 主题颜色。
该方法更灵活，可以单独抽离主题色进行适配。

CSS 变量的作用域与 CSS 的"层叠"规则一致，优先级最高的声明生效。所以当 `body` 上存在 `dark` 类名时，
`:root .dark` 会生效，否则 `:root` 生效。

```css
.article { 
  color: var(--text-color, #eee); 
  background: var(--text-background, #fff); 
} 
:root { 
  --text-color: #000; 
  --text-background: #fff; 
} 
:root .dark { 
  --text-color: #fff; 
  --text-background: #000; 
}
```

使用 `matchMedia` 匹配主题媒体，深色模式匹配 `prefers-color-scheme: dark` ，浅色模式匹配 `prefers-color-scheme: light` 。

监听主题模式，深色模式时为 `body` 添加类名 `dark`，根据 CSS 变量的响应式布局特点，自动生效 `dark` 类名下的 CSS。

```js
const darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

// 判断是否匹配深色模式 
if (darkMode && darkMode.matches) { 
  document.body.classList.add('dark'); 
} 

// 监听主题切换事件 
darkMode && darkMode.addEventListener('change', e => { 
  if (e.matches) { 
    document.body.classList.add('dark'); 
  } else { 
    document.body.classList.remove('dark');  
  } 
});
```