---
id: 1729298754713
created_at: 2024-10-19T08:45:54+08:00
---



# Bash Screen

## 常用

- 离开会话: `Ctrl + a` `d`
- 终止会话: `Ctrl + d`

- `screen -ls` 查看当前会话的名称
- `screen -r <session_name>` 连接指定会话

## 强制分离（detach）会话

- `screen -d <session_name>` 分离指定会话
- `screen -D` 强制分离**当前**会话

## 滚屏

如果想要在 Linux screen 会话中使用鼠标进行上下滚动。必须首先进入该 screen 的回滚(scrollback 模式)才能进行上下滚动

1. 第一步： 进入回滚模式: 首先按 ctrl + a 或者’command + a’. 然后按 Esc
1. 第二步: 使用鼠标滚轮进行上下滑动
1. 第三步：离开回滚模式

按 Esc 就可以退出了。
