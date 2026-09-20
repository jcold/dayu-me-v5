---
id: 1694853954348
created_at: 2023-09-16 16:46
---

今天掉的坑有些复杂，究其主要原因还是对闭包、借用生命周期、静态/动态分发、异步、不透明类型（opaque types）不熟悉导致的。

需求是我需要用户传递一个异步函数来处理我提供的内容，所以很自然的写出如下代码。

// Cargo.toml

```toml
[package]
name = "hw-rs"
version = "0.1.0"
edition = "2021"

[dependencies]
tokio = { version = "1.32.0", features = ["full"] }
```

// main.rs

```rust
use std::future::Future;

async fn process_with_closure<F, Fut>(data: &str, closure: F)
where
    F: Fn(&str) -> Fut, // 闭包的签名，接受一个 &str 参数
    Fut: Future<Output = String>,
{
    // 在这里调用传递进来的闭包
    let result = closure(data).await;
    println!("{}", result);
}

async fn my_closure(s: &str) -> String {
    println!("got {}", s);
    format!("hello")
}

#[tokio::main]
async fn main() {
    let my_string = String::from("Hello, Rust!");

    // 调用函数，并传递闭包作为参数
    process_with_closure(&my_string, my_closure).await;
}
```

编码逻辑简单清晰，但被rustc驳回，报错如下：

```
error[E0308]: mismatched types
  --> src/main.rs:23:5
   |
23 |     process_with_closure(&my_string, my_closure).await;
   |     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ one type is more general than the other
   |
   = note: expected opaque type `impl for<'a> Future<Output = String>`
              found opaque type `impl Future<Output = String>`
   = help: consider `await`ing on both `Future`s
   = note: distinct uses of `impl Trait` result in different opaque types
note: the lifetime requirement is introduced here
  --> src/main.rs:5:20
   |
5  |     F: Fn(&str) -> Fut, // 闭包的签名，接受一个 &str 参数
   |                    ^^^
```

错误指出，调用时的函数签名与接收方的签名不一样。仔细看看就会发现，是编译器自动补全了借用生命周期后，签名不一样了，所以失败，那用Owned数据呢？

```rust
use std::future::Future;

async fn process_with_closure<F, Fut>(data: String, closure: F)
where
    F: Fn(String) -> Fut,
    Fut: Future<Output = String>,
{
    // 在这里调用传递进来的闭包
    let result = closure(data).await;
    println!("{}", result);
}

async fn my_closure(s: String) -> String {
    println!("got {}", s);
    format!("hello")
}

#[tokio::main]
async fn main() {
    let my_string = String::from("Hello, Rust!");

    // 调用函数，并传递闭包作为参数
    process_with_closure(my_string, my_closure).await;
}
```

果然，可以正常运行。似乎明白了，且再看一个例子[^rust-discuss]。


```rust
fn main() {
    let mut input = String::new();
    println!("input unsigned integer:");
    std::io::stdin()
        .read_line(&mut input)
        .expect("readline error");
    let func = match input.trim() {
        "1" => a,
        _ => b,
    };
    func();
}

async fn a() -> u32 {
    println!("pressed 1");
    1
}

async fn b() -> u32 {
    println!("pressed 2");
    2
}
```

这此看似返回值明确吧？但又一次被编译器无情的驳回：

```
error[E0308]: `match` arms have incompatible types
  --> src/main.rs:9:14
   |
7  |       let func = match input.trim() {
   |  ________________-
8  | |         "1" => a,
   | |                - this is found to be of type `fn() -> impl Future<Output = u32> {a}`
9  | |         _ => b,
   | |              ^ expected `a::{opaque#0}`, found `b::{opaque#0}`
10 | |     };
   | |_____- `match` arms have incompatible types
   |
   = note: expected fn item `fn() -> impl Future<Output = u32> {a}`
              found fn item `fn() -> impl Future<Output = u32> {b}`
```

咋看起来有些蒙，我声明闭包类型是`Fn()->u32`，报错给出的是`fn item fn() -> impl Future<Output = u32>`？

仔细看看，我们是用`async`关键字声明的异步函数，它是一个**语法糖**，因此在编译时，编译器会进行脱糖（desugar）操作，如下，

```rust
async fn a() -> u32 {
    1
}
```

脱糖后

```rust
fn a() -> impl Future<Output=u32> {
    async {
        1
    }
}
```

编译器脱糖后，推导出最终类型不匹配导致的，这里如果看不明白，那还需要补习下rust的静态分发和动态分发。

接着改造：指定闭包返回类型，改为动态分发。

```rust
use std::future::Future;
use std::pin::Pin;

#[tokio::main]
async fn main() {
    let mut input = String::new();
    println!("input unsigned integer:");
    std::io::stdin()
        .read_line(&mut input)
        .expect("readline error");
    let func: fn() -> Pin<Box<dyn Future<Output = u32>>> = match input.trim() {
        "1" => || Box::pin(a()),
        _ => || Box::pin(b()),
    };
    func().await;
}

async fn a() -> u32 {
    println!("hit 1");
    1
}

async fn b() -> u32 {
    println!("hit 2");
    2
}
```

终于可以运行了。但是走到这里，还是不能解决，需求参数里的变量借用生命周期问题，自己补全在这个案例上，太繁琐了，最后我也没有成功，还是换条路吧，改为 Trait + impl 的方式实现。

```bash
cargo add async_trait
```

```rust
use std::future::Future;
use async_trait::async_trait;

#[async_trait]
pub trait MyAsyncFn {
    async fn call(&self, s: &str, s2: &str) -> String;
}

async fn process_with_closure<F>(data: &str, closure: F)
where
    F: MyAsyncFn,
{
    // 在这里调用传递进来的闭包
    let result = closure.call(data, data).await;
    println!("{}", result);
}

struct MyClosure;

#[async_trait]
impl MyAsyncFn for MyClosure {
    async fn call(&self, s: &str, s2: &str) -> String {
        println!("{}", s);
        format!("hello")
    }
}

#[tokio::main]
async fn main() {
    let my_string = String::from("Hello, Rust!");

    // 定义一个闭包并将其传递给函数
    let my_closure = MyClosure;

    // 调用函数，并传递闭包作为参数
    process_with_closure(&my_string, my_closure).await;
}
```

这个实现简单多了，不过是有这些优秀的库在背后帮我们做了很多而已。

> 哪有什么岁月静好，只不过是有人在默默为我们负重前行罢了！

## 参考

[^rust-discuss]: https://users.rust-lang.org/t/error-distinct-uses-of-impl-trait-result-in-different-opaque-types/46862