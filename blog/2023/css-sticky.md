---
id: 1696924355185
title: CSS Sticky
created_at: 2023-10-10 15:52
slug: css-sticky
tags: 
    - css
---

`sticky`属性依赖于用户的滚动，在 `position:relative` 与 `position:fixed` 定位之间切换。
元素定位表现为在跨越特定阈值前为相对定位，之后为固定定位。

遇到布局时设置了 `position: sticky;` 发现没有生效，可能的问题原因如下：

- 必须指定 `top`, `right`, `bottom` 或 `left` 四个阈值其中之一（且达到设定的阈值），否则其行为与相对定位相同；

    并且 `top` 和 `bottom` 同时设置时，`top` 生效的优先级高; `left` 和 `right` 同时设置时，`left` 的优先级高

- 元素的**任意父节点**的 `overflow` 属性**必须**是 `visible`；

- 元素的父容器的高度必须大于当前元素。


## 参考

- [CSS：position：sticky；不生效的原因 - 简书](https://www.jianshu.com/p/41663ee18e48)
- [探究 position-sticky 失效问题 - ChokCoco - 博客园](https://www.cnblogs.com/coco1s/p/14180476.html)

