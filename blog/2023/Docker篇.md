---
id: 1694246900532
created_at: 2023-09-09 16:08
update_at: 2023-10-22 20:19
slug: docker-tips
---

*本页目录*

[TOC]

# 搭建OpenVPN服务

```bash
# Step 1: 生成配置
docker run -v /root/openvpn:/etc/openvpn --log-driver=none --rm kylemanna/openvpn ovpn_genconfig -u udp://y4.yuid.org

# Step 2: 初始化pki
docker run -v /root/openvpn:/etc/openvpn --log-driver=none --rm -it kylemanna/openvpn ovpn_initpki

# Step 3: 启动服务
docker run -v /root/openvpn:/etc/openvpn -d -p 1194:1194/udp --cap-add=NET_ADMIN --name ovpn kylemanna/openvpn


# 用户与登录证书

# 创建用户
docker run -v /root/openvpn:/etc/openvpn --log-driver=none --rm -it kylemanna/openvpn easyrsa build-client-full dayu nopass

# 导出用户客户端证书
docker run -v /root/openvpn:/etc/openvpn --log-driver=none --rm kylemanna/openvpn ovpn_getclient dayu > member/dayu.ovpn
```

# Http 代理

```bash
# 启动一个HTTP代理
docker run --restart=always --name=proxy -d -e SQUID_USERNAME=dayu -e SQUID_PASSWORD=K4zm8fZV6jw0n -p 8008:3128 robhaswell/squid-authenticated

# 代理验证
curl -x http://dayu:K4zm8fZV6jw0n@dayu.me:8008/  http://ip.gs
```

# 镜像管理

```bash
docker images --format '{{.Size}}\t{{.Repository}}\t{{.Tag}}\t{{.ID}}' | sort -h

docker exec -it dev-registry-1 bin/registry garbage-collect /etc/docker/registry/config.yml

docker exec -it <registry_container_id> bin/registry delete <image_name>:<tag>

dev.liveio.cn:5000/v2/_catalog

curl -k -X GET https://dev.liveio.cn:5000/v2/_catalog
curl -k -X GET https://dev.liveio.cn:5000/v2/gobuilder/tags/list
curl -k -X GET https://dev.liveio.cn:5000/v2/devops/rust-linux-darwin-builder/tags/list
```

# 删除废弃docker镜像

```bash
docker rmi $(docker images -f "dangling=true" -q)
```


# 镜像 / 容器的导出导入

先需要明白两个概念，镜像和容器。

镜像：使用 `docker images` 命令输出是镜像，可以基于某个镜像启动多个容器，可以自己编译或从指定Docker Hub 上用 `docker pull ...` 拉取。  
容器：使用 `docker ps` 命令输出的是容器，使用 `docker run ...` 来启动。

**镜像** `docker save ...` 导出 / `docker load ...` 导入

```bash
# 可一次导出多个镜像
docker save -o images.tar postgres:9.6 mongo:3.4

# 在目标系统导入。同名的会被覆盖
docker load -i images.tar
```

**容器** (container) 的导出和恢复

```bash
# postgres 使用容器的名称或ID
docker export -o postgres-export.tar postgres

# 恢复为镜像
docker import postgres-export.tar postgres:latest
```

注意：容器导出，==恢复后是镜像==。

ref: 

- [docker save与docker export的区别 - jingsam](https://jingsam.github.io/2017/08/26/docker-save-and-docker-export.html)


# 删除所有停止的容器

```bash
docker ps -a -q -f status=exited | xargs docker rm
```