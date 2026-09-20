---
id: 1694251704402
created_at: 2023-09-09 17:28
---

一份没有实现的API自动化测试工具。

# 断言

一、字符串匹配

```
{
    type: 1,
    op: "eq | lt | le | gt | ge | contains | startWith | endWith"
    value: "str${var}ing"  // ${var}
}
```


二、正则匹配

```json
{
    type: 2,
    value: "regex"
}
```

三、JSON 检测

```json
{
    type: 3,
    jsonPath: '$..name',
    op: "同上",
    value: "值"
}
```

四、数据库检测

```json
{
    type: 4,
    value: "SQL"
}
```

SQL 执行后输出 JSON，结果断言同上面的『JSON 检测』


# 变量提取

```json
[{
    type: 1, // 1=json, 2=regex
    from: "request|post|..."
    varName: "name",       // 变量名称
    rule: 'JSON path | regex',  
    matchNo: 0,            
    computeAll: false,
    default: 'abc'
}]
```

字段属性

1. **matchNo:** 
    匹配结果存储到变量的策略，默认是0。

    * `0` 表示随机一个存储的变量中；
    * `_1` 表示使用数字后缀标识每一个匹配的结果，比如我们匹配了多个name字段的值，那么最终每一个结果都会对应一个变量，变量名称则是name_1、name_2、name_3、name_4....；
    * `X` 表示把第几个匹配到的值赋值给指定的变量，比如写个2，那么就会把匹配到的第2的name字段的值赋值给name。

2. **computeAll:**
    表示如果匹配到多个值，可以将多个值存储在一个变量中，指定的变量名称加_ALL，比如name_ALL，存储的多个值以,分割。

3. **default:**
    表示如果json表达式没有匹配到任何值，那么变量的默认值是啥
