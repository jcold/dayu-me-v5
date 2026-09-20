---
id: 1693454230897
created_at: 2023-08-31 11:58
slug: postgresql-tips
update_at: 2023-10-23 14:02
---

*本页目录*

[TOC]

## 查看相关目录

```sql
-- 配置文件位置
show config_file;

-- 数据目录。如果配置项使用相对路径，则基于此数据目录。
show data_directory;

-- 日志目录
show log_directory;
```

## 备份与恢复数据

注意：以下命令演示基于数据库部署在Docker容器中。

```bash
# 备份导出

# 从数据库服务器本地导出指定数据库
# format用 p(plantext), 其他格式没测成功
docker exec -ti devops-postgres-1 pg_dump --format=p -d tehaochi > tehaochi.sql

# 仅导出库结构，参数 `-s`
# 仅导出数据，参数 `-a`
# 仅导出指定表，参数 `-t mytable`
# 若需身份验证，参数 `-U myuser`


# 恢复数据

# 需要先将本分复制到容器中
docker cp tehaochi.sql devops-postgres-1:/root/

# 创建数据库
docker exec -ti devops-postgres-1 createdb tehaochi

# psql导入
docker exec -ti devops-postgres-1 psql -d tehaochi -f /root/tehaochi.sql
```


## 控制指令

```bash
# 连接并进入Sql交互模式
psql

# 列出所有数据库
\l

# 当前连接信息
\c

# 切换数据
\c [database]

# 所有用户
\du

# 表（含seq)
\d

# 用户表
\dt

# 表字段
\d [table]

```


## 常用运维SQL
```sql
-- 查看数据库启动时长
SELECT date_trunc('second', current_timestamp - pg_postmaster_start_time()) as uptime;

-- 当前数据库**表**占用的硬盘空间
-- 其他数据库将current_database()换为数据库名
SELECT pg_size_pretty(pg_database_size(current_database()));

-- 指定表和索引空间
-- ref: https://pgpedia.info/p/pg_total_relation_size.html
SELECT pg_size_pretty(pg_total_relation_size('your table'));

-- 踢出所有指定数据库的连接
SELECT pg_terminate_backend (pid) FROM pg_stat_activity WHERE datname = 'db';

-- 数据重命名（需要先断开与该库的连接）
ALTER DATABASE db RENAME TO newdb;
```


## 用户与权限

```sql
-- 当前用户
select * from current_user;
-- or
select user;

-- 所有用户
SELECT usename FROM pg_user;

-- 创建用户
CREATE USER tehaochi_u WITH PASSWORD 'your password';

-- 授权
-- 库权限
GRANT ALL PRIVILEGES ON DATABASE tehaochi TO tehaochi_u;
-- 表权限（专家级别在用）
GRANT SELECT, INSERT, UPDATE, DELETE ON tablename TO username_u;

-- 刷新用户权限
ALTER USER tehaochi_u;

-- 吊销用户权限，删除之前比需要做。
REVOKE ALL PRIVILEGES ON DATABASE tehaochi FROM tehaochi_u;
DROP USER tehaochi_u;
-- 如果用户在线，必须踢出
SELECT pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE pg_stat_activity.usename = 'tehaochi';
```

## Mac本地的裸跑PG数据库

```bash
# 初始化数据库
initdb --locale=C -E UTF-8 /usr/local/var/postgresql@14

# 服务启动
brew services start postgresql@14

# 启动命令
/usr/local/opt/postgresql@14/bin/postgres -D /usr/local/var/postgresql@14

# 命令连接
psql -h localhost -U dayu -d postgres
```