---
id: 1694242242604
title: Rust篇
created_at: 2023-09-09 14:50
---


### 找出未用的依赖

```bash
cargo +nightly udeps
```


### 分析依赖大小数量

```bash
cargo install cargo-bloat
cargo bloat --crates
```

### cargo 常用工具

```bash
# 输出所支持的架构
rustup target list

# 安装指定架构的编译工具链
rustup target add x86_64-unknown-linux-gnu

# 编译器版本
rustc -vV
```