---
id: 1715680741838
created_at: 2024-05-14 17:59
title: Rust Build On Windows(10)
---

在线 CI/CD 对我目前来说比较贵，尤其 Windows ，暂时用不起，所以用一台自己的 Windows 机器进行编译。

作以下安装配置

## Vscode (Visual Studio Code)
## Sublime


## Strawberry Perl

若非专业，不要使用 ActiveState 安装。


## Choco

通过 Windows 软件包管理器 [Choco](https://docs.chocolatey.org/en-us/choco/setup) 安装必要的软件包

```bash
choco install git patch make python
```

### Python 包依赖

```bash
pip install requests
```


## rust

1. Rust lang 安装

    Visit <https://www.rust-lang.org/tools/install>

2. bininstall

    为避免一些 cargo 工具包的编译过程，先安装 [binstall](https://github.com/cargo-bins/cargo-binstall) ， 之后再通过 `cargo binstall <xxx>` 直接安装二进制，节省时间。

3. tauri-cli

    ```bash
    cargo binstsall tauri-cli
    ```


## vcpkg

安装 openssl 预编译包。自己编译的话好慢。

1. clone [vcpkg](https://github.com/Microsoft/vcpkg)
1. open directory where you've cloned vcpkg
1. run `./bootstrap-vcpkg.bat`
1. run `./vcpkg.exe install openssl-windows:x64-windows`
1. run `./vcpkg.exe install openssl:x64-windows-static`
1. run `./vcpkg.exe integrate install`
1. run `set VCPKGRS_DYNAMIC=1` (or simply set it as your environment variable)

{.NOTE}
记得添加到 `PATH` 搜索路径。


## Drone exec

Ref: <https://docs.drone.io/runner/exec/installation/windows/>

一、准备两样

1. 与中心通信的配置文件

    ```toml
    DRONE_RPC_PROTO=https
    DRONE_RPC_HOST=dev.everkm.com:8701
    DRONE_RPC_SECRET=super-duper-secret

    # 我还多加了下面的参数，忘了用途
    DRONE_HTTP_BIND=:5430 
    ```

    Ref: <https://docs.drone.io/runner/exec/configuration/reference/drone-http-bind/>


2. 设置日志保存路径通过环境变量 

    通过 Windows 环境变量界面设置，记得重启。

    ```bash
    DRONE_LOG_FILE=C:\Drone\drone-runner-exec\log.txt
    ```

二、注册 Windows 服务并启动

```bash
.\drone-runner-exec.exe service install --config  "C:\Drone\drone-runner-exec\config"
.\drone-runner-exec.exe service start
```


### Troubleshoot

1. ExecutionPolicy 错误

    PowerShell 默认的 ExecutionPolicy 是 `Restricted`, 所以不能执行 Drone 生成的脚本。更改默认配置：

    ``` bash
    Set-ExecutionPolicy RemoteSigned
    ```


## Powershell ExecutionPolicy 执行策略

Ref: <https://learn.microsoft.com/zh-cn/powershell/module/microsoft.powershell.core/about/about_execution_policies>

**简单说明：**

powershell对于脚本的执行有着严格的安全限制

`Get-ExecutionPolicy -List` #查看当前的执行策略

`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` #设置执行策略为要求远程脚本签名，范围为当前用户


**策略 Policies：**

`Restricted` / `AllSigned` / `RemoteSigned` / `Unrestricted` / `Bypass` / `Undefined`

**范围 Scopes：**

`Process` / `CurrentUser` / `LocalMachine`

**设置策略：**

临时使用，不想修改执行策略为较低的权限，可使用：

`Set-ExecutionPolicy Bypass -Scope Process -Force; <Your command>`

开发人员需频繁使用powershell脚本，允许本地脚本运行，可使用：

`Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`


## 环境变量

不区分大小写

```bash
# 打印输出
$env:PATH

# 临时设置
$env:PATH="<New path>;$env:PATH"
```