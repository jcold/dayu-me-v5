---
id: 1711009573047
created_at: 2024-03-21 16:26
updated_at: 2026-06-05T16:49:38+08:00
---

时常有些事儿离不开个在线及时通知，使用国内微信无疑是最方便的，奈何人家不提供这样服务呀，强迫你用企业微信，又或者选择其他的，如钉钉、飞书之类的，太重了不说，还很容易被打扰。最后不得不转向国外的服务，专业专注，非常符合我的口味。

## Telegram Bot 解决方案

### 创建机器人

1. 添加联系人 `@BotFather`, 输入命令 `/newbot`，接着与他聊天交互就可以创建好一个机器人。
2. 创建完成后，它会发给你与机器人聊天的地址，如 `t.me/<Your name of bot>`, 点击即可开启与新建机器人的聊天会话。
3. 使用以下 `curl` 命令，从返回内容中获取 `chat_id`:
    ```bash
    curl https://api.telegram.org/bot<bot token>/getUpdates
    ```

    响应结果如下：

{style="max-height:50vh"}
```yaml macro/include
file: tg_api_getUpdate_response.json
as: code
code_lang: json
```

4. 通过下面的 Web 接口就可以以机器人的身份给自己发消息啦，完美！
    ```bash
    curl -X POST \
        -H 'Content-Type: application/json' \
        -d '{"chat_id": "<chat_id>", "text": "This is a test message from your bot!, 中文"}' \
        https://api.telegram.org/bot<bot token>/sendMessage
    ```

### 设置机器人

```
Edit Bots
/setname - change a bot's name
/setdescription - change bot description
/setabouttext - change bot about info
/setuserpic - change bot profile photo
/setcommands - change the list of commands
/deletebot - delete a bot
```

可以通过 `/setcommads` 给机器人增加一些命令，方便快捷交互。

### 接管机器人后台

习惯使用 Rust ，添加依赖 `<https://lib.rs/crates/telegram-bot>`, 下面是 Demo 代码，具体根据版本会有变动，以官方文档为准。

```rust
use std::env;
use futures::StreamExt;
use telegram_bot::*;

#[tokio::main]
async fn main() -> Result<(), Error> {
    let token = env::var("TELEGRAM_BOT_TOKEN").expect("TELEGRAM_BOT_TOKEN not set");
    let api = Api::new(token);

    // Fetch new updates via long poll method
    let mut stream = api.stream();
    while let Some(update) = stream.next().await {
        // If the received update contains a new message...
        let update = update?;
        if let UpdateKind::Message(message) = update.kind {
            if let MessageKind::Text { ref data, .. } = message.kind {
                // Print received text message to stdout.
                println!("<{}>: {}", &message.from.first_name, data);

                // Answer message with "Hi".
                api.send(message.text_reply(format!(
                    "Hi, {}! You just wrote '{}'",
                    &message.from.first_name, data
                )))
                .await?;
            }
        }
    }
    Ok(())
}
```