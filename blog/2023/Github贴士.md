---
id: 1693919001479
created_at: 2023-09-05 21:03
---

## API

### 获取Repos的最新发布版本

每个道盒主题样式托管在GitHub独立的代码库，[主题官网](https://sites.daobox.cn/themes/)收集部分优质主题，可以在客户端浏览选中后，直接下载最新版本，因此需要这个API获取最新的发布（不含草稿、预发布）版本。

[https://api.github.com/repos/daobox-theme/yilog/releases/latest](https://api.github.com/repos/daobox-theme/yilog/releases/latest)


### 获取最新的发布版本信息

```bash
curl -H "Accept: application/vnd.github.v3+json" https://api.github.com/repos/daobox-theme/yilog/releases/latest
```