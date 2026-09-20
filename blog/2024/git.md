---
id: 1711788919044
title: Git 
created_at: 2024-03-30 16:55
---

## 显示两个版本 (Commit) 指定目录下的差异

```bash
# 注意，指定的相对路径基于当前目录
git diff HEAD..<hash or tag> -- .

# 仅显示文件名和差异
git diff HEAD..<hash or tag> --name-status -- .
```