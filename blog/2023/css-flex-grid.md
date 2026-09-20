---
id: 1696925456256
title: CSS Felx Grid 布局
created_at: 2023-10-10 16:51
slug: css-flex-grid
tags: 
    - css
---

**本页目录**

[TOC]

---

# Grid 布局学习

请移步至 [CSS Grid 网格布局教程 - 阮一峰的网络日志](https://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)。


# :question: CSS Grid 之列宽自适应：auto-fill vs auto-fit，到底什么区别

只有行的宽度大到能够容纳额外的列时，两者的区别才会体现出来。

- 用 `auto-fit` 时，多出来的空白，内容区会自动拉伸以便占满一整行。
- 用 `auto-fill` 时，多出来的空白，不够一列时，均分；大于一列时，填充新的空白列，剩余的再均分。

打开 <https://codepen.io/SaraSoueidan/pen/JrLdBQ>， 拖动改变窗口大小，观察其变化，有助于理解。


**Ref:**

- [[译] CSS Grid 之列宽自适应：`auto-fill` vs `auto-fit` - 掘金](https://juejin.cn/post/6844903565463388168)
- [Auto-Sizing Columns in CSS Grid: `auto-fill` vs `auto-fit` | CSS-Tricks - CSS-Tricks](https://css-tricks.com/auto-sizing-columns-css-grid-auto-fill-vs-auto-fit/)



# :question: Flex或Grid布局时容器被撑大

==使用`min-width:0;`解决。==

在使用Flex或Grid布局时，经常会遇到内容溢出容器或者将容器撑大的情况

例如在grid布局中元素尺寸为1fr，或者flex布局中元素`flex-grow:1`时，想使用Echarts画图和布局中的文本省略显示时发现并没有达到预期的效果，容器被内容撑大了。

想要解决这个问题，首先需要知道容器为什么会被撑大。

我们知道块级元素默认宽度为容器的100%，除了自动得来的宽度之外，控制宽度的属性有 width、min-width、max-width，实际操作会发现设置width也并不能解决我们说到的问题，这就关系到CSS中宽度属性的优先级：

> min-width 属性为给定元素设置最小宽度。它可以阻止 width 属性的应用值小于 min-width 的值。
> 
> min-width 的值会同时覆盖 max-width 和 width。

上面是MDN文档中对min-wdith的解释，可以看到设置宽度的属性当中min-width才是优先级最高的（更准确的说是 min-width 大于 width 和 max-width 时会覆盖 width 和 max-width），也就是说我们设置 width 没起作用是因为 width 的值被 min-width 覆盖了。

了解这点之后，我们自然会想到那当前 min-width 的值是什么？继续查看文档可以看到：

> auto

用于弹性元素的默认最小宽度。相比其他布局中以0为默认值，auto能为弹性布局指明更合理的默认表现。

在弹性元素中，min-width 默认为auto，也就是内容所需要的宽度，所以弹性盒子自然被撑大了。

所以该类问题的解决方案便是：重设`min-width:0;`（或任何小于width的值），让width属性重新拿到元素宽度的控制权，因为width属性默认为内容区域的宽度，所以会自适应弹性盒子宽度，不会撑开容器。

高度也是同理，使用`min-height:0;`解决。

**Ref:**

- [使用min-width解决Flex或Grid布局时容器被撑大的问题 - Nayek - 博客园](https://www.cnblogs.com/nayek/p/16398311.html)
- [解决overflow在flex和grid布局中失效 | Hoofoo's Blog](https://hoofoo-whu.github.io/article/2019-01-15/%E8%A7%A3%E5%86%B3overflow%E5%9C%A8flex%E5%92%8Cgrid%E5%B8%83%E5%B1%80%E4%B8%AD%E5%A4%B1%E6%95%88.html)


