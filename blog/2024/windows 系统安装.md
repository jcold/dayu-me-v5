---
id: 1715729428592
created_at: 2024-05-15 07:30
---

## 系统下载

必须是**纯净版**本, <https://hellowindows.cn/>。



## 制作 USB 启动安装盘

[Rufus](https://rufus.ie/zh/) 一步到位。



## 陈年老调: BIOS 引导安装


**关机**状态下，按完电源键后，再交替 F8/F12 一直按，直到屏幕出现类似的“将使用引导菜单”提示语时停止，后面的过程略过~



## 激活

以管理员身份运行Powershell，键入以下命令：

```bash
irm https://massgrave.dev/get | iex
```

> 稍等片刻会弹出一个批处理窗口，这时根据选项操作即可。选择[1]代表数字许可证激活；选择[2]代表KMS38激活(至2038年)；选择[3]代表使用KMS激活(180天)。这里根据需要，键入1，接下来程序自动执行数字权利激活。至此绿色背景处显示Windows10专业版已经永久激活，整个过程速度很快，完成后关闭所有窗口即可。

Ref: 
1. <https://xiakeshu.com/230.html>
2. <https://github.com/massgravel/Microsoft-Activation-Scripts>


## 使用不愉快

1. 后台任务被暂停 https://www.cnblogs.com/landhu/p/17045466.html