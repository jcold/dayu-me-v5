---
id: 1693474797423
created_at: 2023-08-31 17:40
draft: false
slug: redis-tips
---

### 执行Lua脚本

```bash
# 执行lua脚本，并传递参数
# --ldb: 与eval一起用作调试模式
# Key参数与Arg参数用逗号分开，详见下面的示例脚本
redis-cli --ldb --eval /tmp/script.lua mykey somekey , arg1 arg2

# 直接执行Lua脚本文件
redis-cli SCRIPT LOAD "$(cat /Users/dayu/Coder/go11/lua/get-tree-childs.lua)"

# 从管道中加载脚本
redis-cli -x script load < /Users/dayu/Coder/go11/lua/get-tree-childs.lua
```

**示例脚本**

```lua
local treeKey = KEYS[1]
local fnodeId = ARGV[1]

local function getTreeChild(currentnode, t, res)
    if currentnode == nil or t == nil then
        return res
    end

    local nextNode = nil
    local nextType = nil
    if t == "id" and (type(currentnode) == "number" or type(currentnode) == "string") then
        local treeNode = redis.call("HGET", treeKey, currentnode)
        if treeNode then
            local node = cjson.decode(treeNode)
            table.insert(res, node.id)
            if node and node.childIds then
                nextNode = node.childIds
                nextType = "childIds"
            end
        end
    elseif t == "childIds" then
        nextNode = {}
        nextType = "childIds"
        local treeNode = nil
        local node = nil
        local cnt = 0
        for _, val in ipairs(currentnode) do
            treeNode = redis.call("HGET", treeKey, tostring(val))
            if treeNode then
                node = cjson.decode(treeNode)
                table.insert(res, node.id)
                if node and node.childIds then
                    for _, val2 in ipairs(node.childIds) do
                        table.insert(nextNode, val2)
                        cnt = cnt + 1
                    end
                end
            end
        end
        if cnt == 0 then
            nextNode = nil
            nextType = nil
        end
    end
    return getTreeChild(nextNode, nextType, res)
end


if treeKey and fnodeId then
    return getTreeChild(fnodeId, "id", {})
end

return {}
```
