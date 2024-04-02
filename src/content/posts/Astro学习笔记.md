---
title: Astro学习笔记
pubDate: 2024-04-02
categories: ['Astro']
description: '记录学习Astro的过程'
---

### Astro.props标签属性值传递

作用是复用组件，从其他组件中取值的话，需要给变量加大括号

```html
---
const { platform, username } = Astro.props;
---
<a href={`https://www.${platform}.com/${username}`}>{platform}</a>
```



在Footer.astro，组件标签中可以有属性来传递值，实现了组件间的通信

```html
---
const platform = "github";
const username = "withastro";
import Social from './Social.astro';

---

<footer>
  <p>Learn more about my projects on <a href={`https://www.${platform}.com/${username}`}>{platform}</a>!</p>
  <Social platform="twitter" username="astrodotbuild" />
  <Social platform="github" username="withastro" />
  <Social platform="youtube" username="astrodotbuild" />
</footer>
```



### slot插槽标签内的内容传递给组件

这是index.astro内的代码

```html
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout>
  <h2>My awesome blog subtitle</h2>
  <h3>hello world!</h3>
</BaseLayout>
```

src/layouts/BaseLayout.astro内的代码，可以看到index.astro中用了BaseLayout组件，组件包裹的内容，被插入到了BaseLayout中，这里精妙的点在于，值是在index.astro赋的，但是却传递到了BaseLayout里

```html
---
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';
const pageTitle = "首页";
---
<html lang="zh-cn">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>{pageTitle}</title>
  </head>
  <body>
    <Header />
    <h1>{pageTitle}</h1>
    <slot />
    <Footer />
    <script>
      import "../scripts/menu.js";
    </script>
  </body>
</html>
```

![image-20240402092136848](https://raw.githubusercontent.com/suzulang/typro-picgo/main/EveryDay/202404020921433.png)