---
title: pinia使用指南
pubDate: 2024-03-30
categories: ['前端', 'Vue']
description: ''
---
## 安装pinia

1. 安装pinia

   ```shell
   npm install pinia
   ```

2. 使用pinia

   ```ts
   import { createApp } from 'vue'
   import { createPinia } from 'pinia'
   import App from './App.vue'
   
   const pinia = createPinia()
   const app = createApp(App)
   
   app.use(pinia)
   app.mount('#app')
   ```



## 定义store

定义store，维护一个全局对象，用组合式API写法，显得更加的简洁。

创建`src/stores/token.ts`

组合式API写法

```ts
import {defineStore} from 'pinia'
import {ref} from 'vue'
export const useTokenStore = defineStore('token',()=>{
    const token = ref('')
    const setToken = (newToken)=> {
        token.value = newToken
    }
    const getToken = () => {
        return token.value
    }
    const clearToken = ()=> {
        token.value = ''
    }
    return {token, setToken, getToken, clearToken}
})
```

## 在某个组件中，对token值进行修改

在HelloWord.vue组件中加入下面的代码，实现点击按钮后就会设置一个随机数，来修改**useTokenStore**()维护的全局对象的里面的属性token的值

```vue
<script setup lang='ts'>
import {useTokenStore} from '../stores/token'
const tokenStore= useTokenStore()
const changeToken = () => {
  const newToken = Math.floor(Math.random() * 101)
  tokenStore.setToken(newToken)
  console.log(tokenStore.getToken());
}
</script>

<template>
  <div>
    <button @click="changeToken">点我设置token</button>
  </div>
</template>

<style scoped>

</style>
```

## 在另外一个组件中，获取token的值

创建一个`src/components/Login.vue`，在这个组件下尝试获取一下**useTokenStore**()维护的全局对象的属性token的值

```vue
<script setup lang='ts'>
import { useTokenStore} from '../stores/token'
const tokenStore = useTokenStore()
const getToken = () => {
    console.log(tokenStore.getToken())
}
</script>

<template>
<button @click="getToken">点我获取token</button>
</template>

<style scoped>

</style>
```



## 在App.vue文件中导入这2个组件

因为vue是单页面应用，所以要在App.vue中管理组件。虽然都在App.vue中，但是如果不用pinia来管理全局对象的话，组件与组件之间的值是很难传递和通信的。

```vue
<script setup lang='ts'>
import HelloWorld from './components/HelloWorld.vue';
import Login from './components/Login.vue'
</script>

<template>
  <HelloWorld />
  <br>
  <Login />
</template>

<style scoped>

</style>
```

## 效果

![image-20240322165322250](https://raw.githubusercontent.com/suzulang/typro-picgo/main/EveryDay/202403221653518.png)

可以看到点击上面的按钮，会设置一个值，然后点击下面的按钮，可以或许到值，并且值是一样的，证明组件间的数据可以正常通信了

> 项目代码：https://github.com/suzulang/EveryDay/tree/main/%E7%AC%94%E8%AE%B0%E4%BB%A3%E7%A0%81/Vue/pinia-study