---
id: 1694254450544
created_at: 2023-09-09 18:14
---

使用Let's encrypt可以实现泛域名证书了，唯一缺点是只能3个月有效，好在有高人提供了简便的签发方式。

```bash
docker run --rm  -it  \
  --net=host \
  -v "$(pwd)/dayu.me-cert":/acme.sh  \
  -e Ali_Key="xxxxxxxxxxxx" \
  -e Ali_Secret="xxxxxxxxxx" \
  neilpang/acme.sh --issue --dns dns_ali -d tehaochi.cn -d *.tehaochi.cn \
  --server letsencrypt \
  --dnssleep \
  --log
```