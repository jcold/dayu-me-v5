---
id: 1711614294190
title: 音视频转换
created_at: 2024-03-28 16:24
update_at: 2024-06-25 15:13
---


## wma 音频转 mp3

```bash
# 转换当前目录和子目录下所有 wma 文件格式为 mp3
find . -type f -name "*.wma" -exec ffmpeg -i {} -codec:a libmp3lame -qscale:a 2 {}.mp3 \;
```

解释：

- `-codec:a libmp3lame`：指定音频编解码器为 libmp3lame，用于将音频编码为 MP3 格式。
- `-qscale:a 2`：指定 MP3 的质量，取值范围为 0-9，其中 0 是最高质量，9 是最低质量，一般推荐使用 2-5 之间的值。



## 下载网络 ts/m3u8 资源到 mp4

```bash
ffmpeg -http_persistent 0 -i https://address.m3u8 -c copy output.mp4
```

如果需要下载 m3u8 中指定时间片段的视频，
首先需要定位，但一般的 m3u8 精确定位不容易，最简单的笨办法是，
先拉到大概的时间位置，找到 `.ts` 文件名，再拖到想要的结尾处，记下文件名，
将 m3u8 文件保存到本地后，只保留这两个文件名区域内的记录，注意保留 m3u8 的文件头和尾，
再确认文件中若不是绝对路径，需要补充上原始的域名（与 m3u8 地址同样的域名），
这样可以直接用本地的 m3u8 文件副本作为输入源下载，下载完成后再通过下面的时间参数作精确裁剪。对于大视频截取甚好。

```bash
# 指定截取时间
ffmpeg  -i shu2.mp4 -ss 02:19 -to 06:26 -c copy shu22.mp4
```

- `-ss`: 开始时间
- `-to`: 结尾时间
- `-t`: 持续时间

**Ref:**

1. [如何用ffmpeg截取视频片段&截取时间不准确的坑](https://zxs.io/article/1893)
1. [ffmpeg截取视频片段 - xuejianbest - 博客园](https://www.cnblogs.com/xuejianbest/p/10285284.html)

