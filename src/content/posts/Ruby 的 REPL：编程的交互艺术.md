---
title: "Ruby的REPL: 编程的交互艺术"
pubDate: 2024-08-21
categories: ['Ruby']
---

> 比如，开发软件的时候，一个"交互式顶层解释器"（interactive toplevel）会带来巨大的优势。在Lisp语言中，这种解释器就叫做"读取-求值-打印"循环（read-eval-print loop）。有了这个解释器后，语言的设计就会受到巨大影响。静态类型语言不适合部署这样的解释器，因为静态类型语言要求在使用变量前先声明类型，这对于"交互式顶层解释器"行不通。当你在解释器中输入表达式，然后对变量x进行赋值，接着再对x做进一步处理时，你只想尽快看到结果，肯定不想很麻烦地先声明x的类型。你也许不同意"交互式顶层解释器"为软件开发带来便利的说法，但是如果你接受它，同意易于使用的编程语言必须有一个这样的解释器，那么强制声明变量类型的做法就是与这个解释器不兼容，因此结论就是所有的静态类型语言都不易于编程。  ——《黑客与画家》 15. 设计与研究

作为Ruby新手，今天我尝试讲2个点，如果有讲错的，欢迎大佬指正
1. Ruby语言中REPL（读取-求值-打印循环）的实现工具
2. 探讨REPL如何提高开发效率

## Ruby语言中REPL（读取-求值-打印循环）的实现工具

### 安装和基本使用

首先，安装Pry：
```shell
gem install pry
```
启动Pry：
```ruby
$ pry
[1] pry(main)> 1 + 2
=> 3
[2] pry(main)> "Hello, " + "Pry!"
=> "Hello, Pry!"
```
### Pry的高级特性

#### 代码探索

Pry允许你轻松查看类和方法的定义：
```ruby
[3] pry(main)> show-source Array#map

From: array.c (C Method):
Owner: Array
Visibility: public
Number of lines: 17

static VALUE
rb_ary_map(VALUE ary)
{
    long i;
    VALUE collect;

    RETURN_SIZED_ENUMERATOR(ary, 0, 0, rb_ary_length);
    collect = rb_ary_new2(RARRAY_LEN(ary));
    for (i = 0; i < RARRAY_LEN(ary); i++) {
        rb_ary_push(collect, rb_yield(RARRAY_AREF(ary, i)));
    }
    return collect;
}
  ```
  
#### 上下文导航

可以轻松在不同的上下文中切换：
```ruby
[4] pry(main)> cd Array
[5] pry(Array):> ls
Enumerable# methods: all?  any?  chunk  collect  ...
Array# methods: &  *  +  -  <<  <=>  ==  []  []=  ...
[6] pry(Array):> cd ..
[7] pry(main)>
```
#### 实时编辑

可以直接在Pry中编辑和测试方法：
```ruby
[8] pry(main)> edit-method Array#select

# 这会打开你的默认编辑器，允许你编辑方法
# 保存并退出后，更改会立即生效
```

## 探讨REPL如何提高开发效率

### 快速原型开发

使用Pry，你可以快速测试想法：
```ruby
[9] pry(main)> def factorial(n)
[9] pry(main)*   n <= 1 ? 1 : n * factorial(n-1)
[9] pry(main)* end
=> :factorial
[10] pry(main)> factorial(5)
=> 120
```

### 交互式学习

探索新的gem或API：
```ruby
[11] pry(main)> require 'json'
[12] pry(main)> JSON.methods - Object.methods
=> [:[]，:create_id=，:create_id，:load，:restore，:fast_generate，:pretty_generate，:generator=，:generator，:parser=，:parser，:dump，:parse，:generate，:pretty_unparse，:unparse]
[13] pry(main)> JSON.parse('{"name": "Ruby", "awesome": true}')
=> {"name"=>"Ruby", "awesome"=>true}
```

### 调试

结合pry-byebug进行调试：

```ruby
[14] pry(main)> require 'pry-byebug'
[15] pry(main)> def complex_method(x)
[15] pry(main)*   y = x * 2
[15] pry(main)*   binding.pry  # 设置断点
[15] pry(main)*   z = y ** 2
[15] pry(main)*   z - x
[15] pry(main)* end
=> :complex_method
[16] pry(main)> complex_method(4)

From: (pry) @ line 3 Object#complex_method:

    1: def complex_method(x)
    2:   y = x * 2
 => 3:   binding.pry  # 设置断点
    4:   z = y ** 2
    5:   z - x
    6: end

[17] pry(#<Object>):1> y
=> 8
[18] pry(#<Object>):1> next

From: (pry) @ line 4 Object#complex_method:

    1: def complex_method(x)
    2:   y = x * 2
    3:   binding.pry  # 设置断点
 => 4:   z = y ** 2
    5:   z - x
    6: end

[19] pry(#<Object>):1> z
=> 64
```

## Ruby：一门符合直觉的语言
如果要总结Ruby这门语言的特质，我会说，这是一门符合直觉的语言。Ruby的设计哲学"最小惊讶原则"和"程序员的快乐"与REPL环境完美契合。

例如，当我们想查询一个数组是否为空时，我们可以直接使用Array#empty?方法：
```ruby
[20] pry(main)> [].empty?
=> true
[21] pry(main)> [1, 2, 3].empty?
=> false
```

这种设计让人感觉像是在与Ruby对话，提出问题，然后Ruby就能给出答案。正因如此，即使在纯文本的REPL界面中，不借助IDE的自动补全功能，我们也能轻易猜出想要调用的方法。

Ruby的简洁语法在REPL中特别有用：

```ruby
[22] pry(main)> [1, 2, 3, 4, 5].select(&:even?).map { |n| n ** 2 }
=> [4, 16]
```
这种直观的语法使得在REPL环境中快速实验和原型开发变得非常自然和高效。虽然现代编辑器越来越智能，甚至在命令行界面也能提供自动补全功能，但Ruby语言本身的直观性仍然是其独特魅力所在。

## 总结
通过这些实际的代码示例，我们可以看到REPL（特别是像Pry这样的高级REPL工具）如何显著提高开发效率，促进学习和探索，并影响了Ruby语言的整体设计和使用方式。它鼓励了一种更加交互式、探索性的编程风格，这正是Ruby语言的核心优势之一。

Ruby的REPL环境不仅是一个强大的开发工具，更是体现了这门语言的设计哲学——简洁、直观、富有表现力。它让编程变得更像是一种对话，一种探索，而不仅仅是编写代码。这种特质使得Ruby在快速原型开发、脚本编写、Web开发等领域备受青睐，也使得学习和使用Ruby成为一种愉悦的体验。

