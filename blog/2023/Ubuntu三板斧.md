---
id: 1698046743874
title: Ubuntu/Linux 三板斧
created_at: 2023-08-31 11:36
update_at: 2024-04-07 14:10
slug: ubuntu-tips
---

*本页目录*

[TOC]

记录我的Ubuntu三板斧技能

# 为所有用户增加环境变量

将变量键值对写入 `/etc/environment`。查看如下：

```bash
root@y5:~# cat /etc/environment
PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin"
LOCAL_IP="10.0.4.11"
```

# 永久更改 Host Name

```bash
# 写入新的HostName到文件 /etc/hostname
echo dayu > /etc/hostname

# 显示当前HostName
root@y5:~# hostname
y5

# 查看包括HostName在内系统信息
root@y5:~# hostnamectl
 Static hostname: y5
 Pretty hostname: y5.liveio.cn
       Icon name: computer-vm
         Chassis: vm
      Machine ID: 8053f6f3b11c4c898c03c8dac1ce1ac3
         Boot ID: b1a053915d01402c90fd11c2c43870d1
  Virtualization: kvm
Operating System: Ubuntu 22.04 LTS
          Kernel: Linux 5.15.0-72-generic
    Architecture: x86-64
 Hardware Vendor: Tencent Cloud
  Hardware Model: CVM

```

Pretty hostname 保存在：`/etc/machine-info`。某些情况下需要引用该HostName，还需要在 `/etc/hosts` 文件中增加该地址解析。


# ssh秘钥与git连接

```bash
# 测试私钥是否有权限连接服务器
ssh -T git@dev.liveio.cn -p 2222 -i id_rsa.key

# 使用指定秘钥clone代码库
ssh-agent bash -c 'ssh-add /data/liveio/src/id_ed25519_devops; git clone  ssh://git@github.com/daobox/wz-app.git'

# 生成新的私钥
ssh-keygen -t ed25519 -C "devops@liveio.cn" -m PEM

```


# 使用逻辑卷管理硬盘分区，加装硬盘后系统扩容

查看当前逻辑分区信息：

```bash
root@dev-liveio:~# lsblk
NAME                      MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
loop0                       7:0    0  55.6M  1 loop /snap/core18/2745
loop1                       7:1    0  55.6M  1 loop /snap/core18/2751
loop2                       7:2    0  63.3M  1 loop /snap/core20/1879
loop3                       7:3    0  63.5M  1 loop /snap/core20/1891
loop4                       7:4    0   103M  1 loop /snap/lxd/23541
loop5                       7:5    0 111.9M  1 loop /snap/lxd/24322
loop6                       7:6    0  53.2M  1 loop /snap/snapd/19122
loop7                       7:7    0  53.3M  1 loop /snap/snapd/19361
sda                         8:0    0 931.5G  0 disk
└─sda1                      8:1    0 931.5G  0 part
sdb                         8:16   0 111.8G  0 disk
├─sdb1                      8:17   0     1G  0 part /boot/efi
├─sdb2                      8:18   0     2G  0 part /boot
└─sdb3                      8:19   0 108.7G  0 part
  └─ubuntu--vg-ubuntu--lv 253:0    0     1T  0 lvm  /
sdc                         8:32   0 953.9G  0 disk
└─sdc1                      8:33   0 953.9G  0 part
  └─ubuntu--vg-ubuntu--lv 253:0    0     1T  0 lvm  /
```

要增加 Ubuntu 上的卷组（Volume Group）的大小，你可以按照以下步骤进行操作：

1. 连接硬盘：将新的硬盘连接到计算机，并确保系统正确识别了它（可以使用 `sudo fdisk -l` 命令进行检查）。

2. 创建物理卷（Physical Volume）：使用 `pvcreate` 命令创建新的物理卷。假设新硬盘的设备路径是 `/dev/sdX`，可以使用以下命令创建物理卷：

    ```bash
    sudo pvcreate /dev/sdX
    ```

3. 将物理卷添加到现有的卷组：使用 `vgextend` 命令将新创建的物理卷添加到现有的卷组中。假设现有卷组的名称是 `myvg`，可以使用以下命令将物理卷添加到该卷组：

    ```bash
    sudo vgextend myvg /dev/sdX
    ```

4. 扩展卷组的逻辑卷：一旦物理卷添加到了卷组中，你可以使用 `lvextend` 命令来扩展卷组中逻辑卷的大小。假设要扩展的逻辑卷名称是 `mylv`，可以使用以下命令扩展该逻辑卷的大小：

   ```bash
   sudo lvextend -l +100%FREE /dev/myvg/mylv
   ```

   上述命令中的 `-l +100%FREE` 指定将逻辑卷扩展到卷组中可用的所有剩余空间。

5. 扩展文件系统：最后一步是扩展逻辑卷上的文件系统，以便可以利用新增的空间。根据使用的文件系统类型，你可以使用适当的命令进行扩展。例如，对于 ext4 文件系统，可以使用 `resize2fs` 命令进行扩展：

   ```bash
   sudo resize2fs /dev/myvg/mylv
   ```

完成上述步骤后，卷组的大小应该已成功增加，并且逻辑卷和文件系统已经占用了新增的空间。

请注意，在进行任何操作之前，请确保你了解自己的硬件和系统要求，并小心谨慎地操作。此外，确保你对 LVM 的操作非常熟悉，以免不小心删除或修改了错误的卷。建议在操作前进行充分的测试和验证，并备份重要数据。


Ref: https://blog.yqxpro.com/2021/10/31/%E9%80%9A%E8%BF%87LVM%E7%BB%99Ubuntu%E6%B7%BB%E5%8A%A0%E7%A1%AC%E7%9B%98%E7%A9%BA%E9%97%B4/


# ssh与socks5代理

```bash
# 本地拨入远程主机，并打开一个Socks5代理
ssh  -p 11022 -D 127.0.0.1:1337 -N root@y4.dayu.me
```

**参数**

* `p`: 远程主机ssh端口 
* `D`: 本地监听的地址与端口
* `N`: 不执行命令，仅作端口转发


# ssh反向代理

```bash
# 将本地的9080端口反向拨入到远程主机y4.dayu.me的5001端口，远程主机的ssh端口为11022。
# 最后的作用是：y4.dayu.me:5001  -> localhost:9080
ssh -CNR 5001:localhost:9080 root@y4.dayu.me -p 11022
```


# 找回ssh公钥

```bash
ssh-keygen -y -f ~/.ssh/id_rsa > ~/.ssh/id_rsa.pub
```

**ref**:

- [如何找回ssh公钥 - 简书](https://www.jianshu.com/p/84645538b639)


# 高效压缩工具之xz

高压缩率的工具，它使用 LZMA2 压缩算法，生成的压缩文件比传统使用的 gzip、bzip2 生成的压缩文件更小，
详情见[官网](https://tukaani.org/xz/)。

```bash
xz [选项] [参数]
```

主要参数说明：

```bash
-z --compress  # 强制压缩
-d --decompress # 解压缩
-t --test # 测试压缩文件的完整性
-k --keep # 压缩或解压时保持源文件不被删除
-l --list # 列出有关.xz文件的信息
-0~9 # 指定压缩率，默认为6;
-h --help # 显示这个简洁的帮助并退出
-H --long-help # 显示更多帮助（还列出了高级选项）
-V --version # 显示版本号并退出
```

eg: [^eg]

[^eg]: [你能分清e.g.和i.e.吗？ - 阮一峰的网络日志](https://www.ruanyifeng.com/blog/2005/09/egie.html)


```bash
# xz压缩
xz nohup.log

# 解压使用-d参数，如果保留源文件可以加-k
xz -dk nohup.log.xz 

# 参数 -l 显示 .xz 文件的压缩率、数据完整性验证方式等基本信息
xz -l nohup.log.xz 

# xzcat对已压缩日志直接查看并过滤，或者 xzgrep 直接过滤
xzcat nohup.log.xz | grep "18:29"
```



# 加载环境变量

从当前目录中的 `.env` 文件中加载环境变量

```bash
export $(grep -v '^#' .env | xargs -0)
```


# find 搜索

```bash
find /Users/dayu/Coder -type d \( -name target -o -name node_modules -o .git \) -prune -o -type d -name "pages" -print 2>/dev/null
```

## 命令概述
在 `/Users/dayu/Coder` 目录下搜索所有名为 **`pages`** 的**目录**，同时排除（跳过）不需要搜索的目录。

## 核心功能
- **搜索目标**：查找所有名为 `pages` 的目录
- **搜索范围**：`/Users/dayu/Coder` 及其子目录
- **排除目录**：自动跳过 `target`、`node_modules`、`.git` 这三个目录及其所有子目录

## 技术特点
- 使用 `-prune` 参数直接跳过排除目录，提高搜索效率
- 使用 `-o` (OR) 组合多个条件
- 将错误信息重定向到 `/dev/null`，避免权限错误等干扰输出

## 输出结果
- 只显示匹配的 `pages` 目录的完整路径
- 每行一个路径，例如：
  ```
  /Users/dayu/Coder/project1/pages
  /Users/dayu/Coder/project2/src/pages
  ```

## 适用场景
特别适合在开发环境中搜索，避免被依赖目录（node_modules）、构建目录（target）和版本控制目录（.git）中的大量无关文件干扰搜索结果。

必须要加 `-print`，否则可能不同的平台输出有差异，我在 MacOS 上会输出前半段匹配的路径。