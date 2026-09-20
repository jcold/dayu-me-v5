---
id: 1697010471519
title: Rust 跨平台交叉编译
created_at: 2023-10-11 15:48
slug: rust-cross-builder
---

直接上Linux镜像，编译Windows, Linux Target。地址如下：

- For Windows & Linux: [Package x86_64-pc-windows-gnu](https://github.com/cross-rs/cross/pkgs/container/x86_64-pc-windows-gnu)

需要自己安装rust, 国内稳定的用 [RsProxy](https://rsproxy.cn/#getStarted)。

**坑**：制作镜像时，遇到报错：

```
rustup: Unable to run interactively. Run with -y to accept defaults, --help for additional options
```

**填**：添加参数 `-y`。

```bash
curl --proto '=https' --tlsv1.2 -sSf https://rsproxy.cn/rustup-init.sh | sh -s -- -v -y 
```

Ref: <https://github.com/m-ab-s/media-autobuild_suite/issues/915>
