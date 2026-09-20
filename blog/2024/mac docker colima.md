---
id: 1712386228900
title: Mac Docker colima
created_at: 2024-04-06 14:50
---

## 安装启动

Docker Desktop 在 MAC 上启动太费资源，一直想换掉，今天终于花点时间处理下。

问了 Claude，Mac 上都有哪些轻量级的 Docker 容器推荐，第一个是 [`colima`](https://github.com/abiosoft/colima), MIT 开源。先用用试试。

安装挺方便
```bash
# Homebrew
brew install colima

# 启动
colima start
```

不是那么丝滑，报错了
```
QEMU (homebrew) was broken on Intel: [hostagent] Driver stopped due to error: "signal: abort trap" (or "exit status 255") ... QEMU has already exited
```

网上搜索得到：

```
brew reinstall -f --force-bottle qemu
```

尝试后无用，应该是旧版本的 `qemu` 问题，不过很早已经修复了。继续查找错误日志发现：
```
time="2023-08-16T11:22:47-04:00" level=warning msg="QEMU binary "~/.colima/_wrapper/3a9197e1ca3cd2da076da2b473d7a7eb118e2cca/bin/qemu-system-aarch64" is not properly signed with the "com.apple.security.hypervisor" entitlement" error="binary
```

[解决方法](https://github.com/lima-vm/lima/issues/1742#issuecomment-1680834167) :point_down:


> 1. ARM Mac or Intel Mac?
> 2. Does `limactl start` (not `colima start`) print the same warning? If `limactl start` does not print a warning, it is an issue of colima.
> 3. Output of `codesign --display --entitlements - --xml /opt/homebrew/Cellar/qemu/8.0.4/bin/qemu-system-aarch64`  ? (qemu binary path might be different)

通过下面命令启动
```bash
limactl start
```

会重新 sign，之后不再报错。


## 简单设置

```bash
# 进入
colima ssh

# 安装 vim
apt-get update
apt-get install -y vim

# 设置 registry_mirrors, proxy

vim /etc/docker/daemon.json

# 重新加载配置
systemctl daemon-reload
systemctl restart docker
```

设置后 `cat /etc/docker/daemon.json`
```json
{
  "exec-opts": [
    "native.cgroupdriver=cgroupfs"
  ],
  "features": {
    "buildkit": true
  },
  "registry-mirrors": [
    "https://daeitjf30byu.mirror.aliyuncs.com",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ],
  "proxies": {
    "http-proxy": "http://192.168.31.239:7890",
    "https-proxy": "http://192.168.31.239:7890"
  }
}
```


也可以在外面直接执行
```bash
colima ssh -- sudo vim /etc/docker/daemon.json
```

之后可以愉快的在命令行下 docker 命令了。


## 常见的 Colima CLI 命令及其说明：

- `colima start` - 启动 Colima 容器运行时。
- `colima stop` - 停止 Colima 容器运行时。
- `colima restart` - 重启 Colima 容器运行时。
- `colima status` - 显示 Colima 容器运行时的状态信息。
- `colima ssh` - 通过 SSH 连接到 Colima 容器运行时。
- `colima ip` - 显示 Colima 容器运行时的 IP 地址。
- `colima info` - 显示有关 Colima 容器运行时的详细信息，包括版本、磁盘使用情况和安装路径等。
- `colima doctor` - 运行诊断程序以检查 Colima 容器运行时的配置和设置是否正确。
- `colima web` - 在本地浏览器中打开容器中运行的应用程序。

Ref：<https://juejin.cn/post/7223045442892234812>


## 使用感受

轻量化的期望并没有什么大的改善（可能跟我未做虚拟机的相关设置有关），启动后， qemu 虚拟机还是占用 3G+ 内存，真是伤不起。
有空再研究。