---
id: 1717310320467
created_at: 2024-06-02 14:38
---

APP 的健壮运行离不开错误监控，而其中 native 库的 crash 最麻烦，这也是混合语言没有官方推荐单一语言开发简便的原因之一。
最近 Everkm Note 在集成测试阶段，就遇到 crash 问题，好在经过简单的代码排查，基本可以猜测到原因，问题发生在 rust + bind(libssh) 上面，费了点功夫就修复了（这里还是忍不住夸赞下 Rust 的优秀，什么空指针异常，线程安全，都能很好的规避）。但如果是在生产环境，那就需要许多额外工作才能定位，初步想到的有

1. Crash 监控（含 native lib）上报
2. 符号表管理
3. 堆栈映射源码位置
4. 模拟数据测试排查

此次未来得及深入，待日后继续深究。

Ref:

1. [ndk rust null pointer crash - Google 搜索](https://www.google.com.hk/search?q=ndk+rust+null+pointer+crash&newwindow=1&sca_esv=d8f10933e16e7e97&sca_upv=1&sxsrf=ADLYWIKyMgAIAeieCBqWbg0afxI_6Z35Vg%3A1717305722331&ei=egFcZr3oE47YseMPvNmbkAU&ved=0ahUKEwi9jbOslryGAxUObGwGHbzsBlIQ4dUDCBA&uact=5&oq=ndk+rust+null+pointer+crash&gs_lp=Egxnd3Mtd2l6LXNlcnAiG25kayBydXN0IG51bGwgcG9pbnRlciBjcmFzaDIEECMYJzIIEAAYgAQYogQyCBAAGIAEGKIEMggQABiABBiiBDIIEAAYgAQYogRI5wxQ6ARY6ARwAngAkAEAmAGfAaABnwGqAQMwLjG4AQPIAQD4AQGYAgGgArcBmAMAiAYBkgcDMC4xoAeYAw&sclient=gws-wiz-serp#ip=1)
1. [Android NDK崩溃行定位_obtaining output fd from tombstoned, type: kdebugg-CSDN博客](https://blog.csdn.net/u012456479/article/details/123111979)
1. [Android Native Crash问题排查思路-腾讯云开发者社区-腾讯云](https://cloud.tencent.com/developer/article/1905391)
1. [android ndk空指针导致CRASH的问题_android ndk构造空指针崩溃-CSDN博客](https://blog.csdn.net/ryfdizuo/article/details/9011425)
1. [Debugging a Rust Segfault with Sentry | Product Blog • Sentry](https://blog.sentry.io/debugging-a-segfault-in-rust/)
1. [Cannot get backtrace (stack trace) on Android devices; does this lib support android? · Issue #442 · rust-lang/backtrace-rs](https://github.com/rust-lang/backtrace-rs/issues/442)
1. [stdlib: Missing backtrace on panic when using `std::backtrace::Backtrace` vs `backtrace::Backtrace` on Android · Issue #121033 · rust-lang/rust](https://github.com/rust-lang/rust/issues/121033)
1. [记录一次 SEGV_MAPERR 问题的分析、解决过程 - 舞风雪的独立博客](https://wufengxue.github.io/2020/06/22/wechat-voice-codec-SEGV_MAPERR.html)
1. [ndk-stack  |  Android NDK  |  Android Developers](https://developer.android.com/ndk/guides/ndk-stack?hl=zh-cn)
1. [缩减、混淆处理和优化应用  |  Android Studio  |  Android Developers](https://developer.android.com/build/shrink-code?hl=zh-cn#strip-native-libraries)
