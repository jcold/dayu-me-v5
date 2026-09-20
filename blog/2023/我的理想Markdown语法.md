---
id: 1695210231861
created_at: 2023-09-10 11:13
updated_at: 2026-03-18T16:36:59+08:00
update_at: 2023-10-03 10:57
slug: daobox-extend-markdown
---

{.notice tc bgcolor="#FAC03D"}
*停止更新！请前往[道盒发布]获得支持。*

**本页目录**

[TOC]

# 更新日志

## 2023-10-03

本格式规范迁移至[道盒发布]实现，希望能为有相关痛点的你提供帮助。至此不再更新，如有意见建议，欢迎前往[道盒发布]讨论。

## 2023-09-22

**新增**

* [宏](#everkm-macro)`{{everkm::include()}}`包含
* [内部链接](#inner-link)
* [页内锚点](#page-anchor)

## 2023-09-12

比较难找到符合需求的Markdown解析器，所以花了些时间自己实现了个。已集成至[道盒发布]，免费使用，Enjoy! :non-potable_water: :-1: :+1: :tada::tada::tada:

---

用了这么长时间文本编辑器，总对格式不能自由掌控感到不快，直到使用了Markdown。Markdown是近年来较为流行的文本标记语言，简单易用是它的核心特点，因为简单，所以格式不是那么丰富，在某些场景下无法满足需求，若是退回，则又回到开始，纠结使用哪个编辑器。索性今天整理下Markdown语法诉求，看看能否对其扩展，以满足日常需求？

# 基础语法 ✅

1. 基于[Markdown标准语法](https://daringfireball.net/projects/markdown/syntax)[^markdown-syntax]。部分格式有几种表达方式，这里仅罗列其一种。
2. 补充[Github Markdown](https://github.github.com/gfm/)[^gfm]扩展语法。

<pre>

# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题


* 无序列表1
* 无序列表2
* 无序列表3


1. 有序列表1
1. 有序列表2
1. 有序列表3
1. 可以顺序标号，或者全部用1
    最终渲染时会自动矫正编号。
    如果前面带有缩进，会自动归为上个列表项的范围。


`行内代码`


```js
console.log('代码块+语法高亮')
```


水平分割线
---


[链接](https://www.everkm.cn "标题可省略")
[页内链接](#链接ID)


![图片替换描述](/path/to/img.jpg "图片标题可省略")


*斜体*
**粗体**
***粗斜体***


> 引用内容
> 嵌套内容可以包含上面的格式
> > 嵌套引用内容

</pre>


# 语法扩展


{#everkm-macro}
## 宏 

### TOC (Table of content) ✅

对于长篇大作，良好的目录索引（TOC）对阅读很有帮助，所以需要增加TOC的宏标记，渲染时自动替换。效果见本页开始。

```markdown
[TOC]

{{everkm::toc()}}

{{everkm::toc(level=1)}}
```

可选参数：

* `level` 搜索的标题级别，默认 `level=3`

**Toc 示例**

{{everkm::toc(level=1)}}

---

### 包含外部文件 ✅

渲染时将指定文件内容包含进来。仅允许常见的{ul}#**纯文本**#文件，常见扩展名为md, txt, csv, js等程序源文件。

参数:

- `file`: 文件的绝对路径或者相对路径。

可选参数：

* `as` 输出格式。取值范围：
    1. `plain`(默认值)，渲染时原样输出
    1. `table` 尝试解析为表格
    1. `code` 代码
    1. `md` or `markdown`, 以Markdown格式解析
* `code_lang` 编程语言，仅 `as="code"` 时有效。
* `table_header` 第一行是否为表头，仅 `as="table"` 时有效。
* `table_merge` 是否自动合并单元格。值与单元格内容相同则合并，合并顺序为先行后列。例如：合并所有空内容的单元格，可以增加参数 `table_merge=""`。仅 `as="table"` 时有效。

**包含Markdown示例：**

```markdown
{{everkm::include(file="_include_test.inc.md", as="md")}}
```
{{everkm::include(file="_include_test.inc.md", as="md")}}

---

**包含表格示例：**

所有*号内容的单元格自动合并，并且使用扩展属性。

```markdown
{align=center}
{{everkm::include(file="demo.csv", as="table", table_header=true, table_merge="*")}}
```

{align=center}
{{everkm::include(file="demo.csv", as="table", table_header=true, table_merge="*")}}

---

**包含代码示例：**

```markdown
{{everkm::include(file="_xx.js", as="code", code_lang="js")}}
```


{#inner-link}
## 内部链接 ✅ 

适用于项目内的文件跳转。支持非HTML页面链接，如PDF文档等，该文件在输出时自动复制到静态资源目录。

```markdown
[[文件名]]

[[...目录/文件名]]
```

当主题（双括号内为主题）只有一个标题时，则查找整个内容目录，文件名相同（忽略 `.md` 扩展名）则匹配成功。如果有多个同名文件，则返回第一个。如需避免这种同名定位，可以在前面加上目录限定。目录识别以下几种：

1. 以 `/` 打头表示以内容根目录严格匹配。
2. 以 `./` (当前文件目录) 或 `../` (当前文件的上一级目录) 表示以当前文件为基准的相对定位。
3. 除上述外，均以主题为后缀，搜索所有内容文件。

示例：[[永不消失的独立站]]

{#page-anchor}
## 页内锚点 ✅ 

适用于页面内部不同位置之间的跳转。目前仅适用于标题:exclamation:。

标题增加`id`属性后会自动生成锚点，如果未指定`id`属性，默认使用`HA-`加上标题内容地址化[^slugify]生成锚点，可在链接中使用`#id`实现页内锚点跳转。


## 自动转换链接 ✅

```markdown
<https://www.everkm.cn>
```

hello <https://www.everkm.cn>{target=_blank color=red} world


{.main .shine #the-site lang=zh}
## 标题、链接、图片扩展属性 ✅ 

可以对下面块增加属性，属性支持CSS样式名，ID，和其他自定义属性

1. 标题 ✅
2. 链接 ✅
3. 图片 ✅

```markdown
带有扩展属性的[道盒](https://www.everkm.cn){color=orangered}链接。

![Air](https://images.unsplash.com/photo-1564979045531-fa386a275b27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80 "蓝天与狗尾巴草"){corner=1em}
```

带有扩展属性的[道盒](https://www.everkm.cn){color=orangered}链接。

![Air](https://images.unsplash.com/photo-1564979045531-fa386a275b27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80 "蓝天与狗尾巴草"){corner=1em}


## 段落属性 ✅

```markdown
{bgcolor="rgba(0,0,0,0.1)" color=blue underline pa=1em corner=0.5em}
这是一段区块示例内容，它拥有扩展属性。
```

{bgcolor="rgba(0,0,0,0.1)" color=blue underline pa=1em corner=0.5em}
这是一段区块示例内容，它拥有扩展属性。

## 文字颜色、背景色、字体 ✅

```markdown
{color=red, bgcolor=yellow .nice}#赤色#
{font=宋体}#我是有不一样的字体#
```

我有{color=red, bgcolor=yellow .nice .girl}#赤色#的文本和{color=blue}#蓝色#内容。

我的字体是{font="思源宋体 CN"}#思源宋体 CN#,
我的字体是{font="阿里妈妈东方大楷"}#阿里妈妈东方大楷#,

## 表格 ✅

<pre>
First Header  | Second Header
------------- | -------------
Content Cell  | Content Cell
Content Cell  | Content Cell
</pre>

或者两端加上管道符

<pre>
| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |
</pre>

单元格对齐

<pre>
| 默认对齐   | 左对齐 | 中对齐 | 右对齐 |
| ---       | :---  | :---: | ---:  |
| Content   | Content | Content | Content |
| Content   | Content | Content | Content |
</pre>

{align=center .my-table}
| 默认对齐   | 左对齐 | 中对齐 | 右对齐 |
| ---       | :---  | :---: | ---:  |
| Content   | Content | Content | Content |
| Content   | Content | Content | Content |



## 定义列表 （Definition Lists） ✅

<pre>
Apple

:   Pomaceous fruit of plants of the genus Malus in 
    the family Rosaceae.

Orange

:   The fruit of an evergreen tree of the genus Citrus.
</pre>

Apple

:   Pomaceous fruit of plants of the genus Malus in 
    the family Rosaceae.

Orange

:   The fruit of an evergreen tree of the genus Citrus.


## 脚注/引用 ✅

`[^数字|字母中线下划线组合]`字符后面可以用数字标号，或字母与下划线、中线的组合，渲染时系统自动重新编号。

<pre>
That's some text with a footnote.[^1]

[^1]: And that's the footnote.
      That's the second paragraph.
</pre>

That's some text with a footnote.[^1]

[^1]: And that's the footnote.
      That's the second paragraph.


## 强调

### 删除线 ✅

```markdown
~~删除线~~
```

~~删除线~~

### 下划线 ✅

```markdown
{ul}#下划线#
```

{ul}#下划线#

### 上标 ✅

```markdown
E=MC^2^
```

E=MC^2^

### 下标 ✅

```markdown
H~2~O
```

H~2~O


## 任务列表 ✅

```markdown
- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media
```

- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media

## 多处同一脚注
示例：语法 [^gfm]扩展。

## 高亮 ✅

```markdown
I need to highlight these ==very important words==.
```

I need to highlight these ==very important words==.

HTML结果

```html
I need to highlight these <mark>very important words</mark>.
```

## 特殊字符替换 ✅

```markdown
| => &#124;
> => &gt;
< => &lt;
(C) © 版权
(TM) ™ 商标
(R) ® 注册商标
-- —— 破折号
... …​省略号
-> → 右箭头
<- ← 左箭头
=> ⇒ 右双箭头
<= ⇐ 左双箭头

```

## 常用符号 ✅

1. [HTML特殊符号](https://chaooo.github.io/unicode_css3_content/) ✅
2. [emoji表情符号](https://gist.github.com/rxaviers/7360908) ✅

:point_right:查找emoji[表情](https://github-emoji-picker.rickstaa.dev/) :smile: :muscle: 。


## 数学公式（部分支持）

行内公式：$E = mc^2$

块公式：
$$
\begin{aligned}
f(x) &= \int_{-\infty}^\infty \hat f(\xi)\,e^{2 \pi i \xi x} \, d\xi \\
\frac{\partial u}{\partial t} = \alpha \nabla^2 u
\end{aligned}
$$


## 参考

[^markdown-syntax]: <https://daringfireball.net/projects/markdown/syntax>

[^gfm]: <https://github.github.com/gfm/>

[道盒发布]: https://publish.everkm.cn

[^slugify]: 通过对文本转换，从而生成有效链接地址。英文字母数字保持原样，空格替换为`-`，中文每个字符转换拼音后，使用`-`连接。==注:exclamation:==：字母+中文的连接处没有连字符`-`，如果需要请在中间添加英文空格。


[道盒发布]: https://publish.everkm.cn