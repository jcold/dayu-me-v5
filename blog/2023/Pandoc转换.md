---
id: 1694254366293
created_at: 2023-09-09 18:12
---

## epub文件为markdown格式

```bash
pandoc --extract-media=media xxx.epub -f epub -t markdown -o output.md
```