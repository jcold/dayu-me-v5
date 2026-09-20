---
id: 1750388433354
created_at: 2025-06-20 11:00
---

# 升级到 macOS 15.5 Sequoia


## 遇到的问题

### `drone-runner-exec` 报错

    "connect: no route to host"

升级后对网络限制更严格，是不允许访问网络的。

命令行程序可以用以下命令解决

```bash
# 启用应用的网络访问
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblock /path/to/drone-runner-exec

# Help
sudo /usr/libexec/ApplicationFirewall/socketfilterfw -h
```