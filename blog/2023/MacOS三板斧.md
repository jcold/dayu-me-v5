---
id: 1694254130857
created_at: 2023-09-09 18:08
update_at: 2023-10-05 17:46
slug: macos-tips
---

## 监听目录数据变化

```bash
# 当前目录变化时，打印出路径
fswatch -0  . |xargs -0 -n1 -I{} echo {}

# eg. 当指定目录文件变化时，自动SASS编译
fswatch -0 ~/ybf5/src/assets/css/view.scss | xargs -0 -n1  ~/bin/sass {} ~/ybf5/dist/static/css/view.css
```

## 查找指定目录并添加到TimeMachine中忽略

```bash
# 先查找下看看是不是想要的？
# 括号内 -o 连接 表示多个 or 操作
# -prune 表示命中后停止深入搜索子目录
find ~/ -type d \( -name "target" -o -name "node_modules" -o -name ".pnpm" -o -name ".vscode" -o -name ".nvm" -o -name ".cargo" \) -prune -print

# 将命中的目标添加到TimeMachine
find ~/ -type d \( -name "target" -o -name "node_modules" -o -name ".pnpm" -o -name ".vscode" -o -name ".nvm" -o -name ".cargo" \) -prune -exec tmutil addexclusion {} \;

# 命令行添加的无法在界面中列出，只能使用命令检查是否已加入忽略
tmutil isexcluded "/you/root/node_modules"
```