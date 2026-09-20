---
id: 1694960227141
created_at: 2023-09-17 22:17
---

今天在在写Rust项目是，添加了自己私有的rust项目，以ssh+git的方式，本地运行无障碍，可在在CI环境时，一直提示秘钥不对，耽搁了几个小时。经过一番排查，是因为CI的编译环境使用的是裸版的系统，这类镜像通常git与ssh环境不完整，所以一直提示以下错误

```
Caused by:
  Unable to update ssh://git@dev.liveio.cn:2222/daobox/wz-app.git#d487ad66

Caused by:
  failed to clone into: /usr/local/cargo/git/db/wz-app-1c1019b8dda5762b

Caused by:
  failed to authenticate when downloading repository

  * attempted ssh-agent authentication, but no usernames succeeded: `git`

  if the git CLI succeeds then `net.git-fetch-with-cli` may help here
  https://doc.rust-lang.org/cargo/reference/config.html#netgit-fetch-with-cli

Caused by:
  no authentication available
```

本次掉坑的是ssh-agent未启动，导致私钥未生效所致。

以下是完整的配置

```bash
mkdir $HOME/.ssh

# 添加git server主机指纹
ssh-keyscan -p 2222 dev.liveio.cn > $HOME/.ssh/known_hosts

# 导入部署的私钥
echo "$KEY" > $HOME/.ssh/id_rsa
chmod 600 $HOME/.ssh/id_rsa

# 测试私钥是否能正常登录
ssh -T git@dev.liveio.cn -p 2222 -i $HOME/.ssh/id_rsa

# 这两行与openssh的版本有关，貌似现在最新的版本算法都变了，增加这两行为了
# 适配低版本秘钥
echo HostKeyAlgorithms         +ssh-rsa > $HOME/.ssh/config
echo PubkeyAcceptedKeyTypes    +ssh-rsa >> $HOME/.ssh/config

# 设置Cargo的git依赖使用cli环境Clone
mkdir $HOME/.cargo
echo net.git-fetch-with-cli = true > $HOME/.cargo/config
cat $HOME/.cargo/config

# 下面很重要，通常裸版镜像不启动ssh代理，所以无法正常关联秘钥，
# 因此如果需要就得手动启动，并添加秘钥，这样才能被git+ssh正确使用。
eval $(ssh-agent)
ssh-add ~/.ssh/id_rsa
# 打印下都有哪些私钥生效中
ssh-add -l
```