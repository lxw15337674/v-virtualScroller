# v-virtualScroller

基于vue的虚拟滚动组件

## 特性

- 支持横向、纵向、横纵使用三种虚拟滚动方式。
- 支持不同长度的元素。

## 用法

1. 安装插件

   ```
   npm install -s @lxw15337674/v-tip
   ```

2. 注册为全局组件

   ```
   import tip from '@lxw15337674/v-tip';
   
   Vue.use(Vtip,{directiveName:'tip',theme:'dark'})
   ```


## virtual-scroller

单向虚拟滚动组件

### 基本用法

```html
<template>
<virtual-scroller :items="items" v-slot="{ index, size, active }">
                <div>{{ index }}{{ size }} {{ active }}</div>
  </virtual-scroller>
</tempalte>
<script>
export default {
    data() {
        return {
            items: [20, 20, 20, 20, 20],
        };
    },
};
</script>
```


### 组件props参数

| 参数      | 说明                       | 类型   | 是否必填 | 可选值                  | 默认值     |
| --------- | -------------------------- | ------ | -------- | ----------------------- | ---------- |
| items     | 元素长度集合（以px为单位） | array  | 是       |                         |            |
| direction | 虚拟滚动方向               | string | 否       | `vertical`,`horizontal` | `vertical` |
### 元素slot参数

| 参数   | 说明             | 类型    |
| ------ | ---------------- | ------- |
| size   | 元素的长度       | number  |
| index  | 元素在集合的位置 | number  |
| active | 元素激活状态     | Boolean |

## virtual-scroller-table

同时支持横向纵向的虚拟滚动组件

### 基本用法

```html
<template>
    <virtual-scroller-table
                            :cols="cols"
                            :rows="rows"
                            v-slot="{ rowIndex, colIndex, active }"
                            >
        <div>{{ colIndex }}{{ colIndex }} {{ active }}</div>
    </virtual-scroller-table>
</tempalte>
<script>
export default {
    data() {
        return {
            rows: [20, 20, 20, 20, 20],
            cols: [20, 20, 20, 20, 20]
        };
    },
};
</script>
```

### 组件props参数
| 参数 | 说明                         | 类型  | 是否必填 | 可选值 | 默认值 | 举例             |
| ---- | ---------------------------- | ----- | -------- | ------ | ------ | ---------------- |
| rows | 元素行长度集合（以px为单位） | array | 是       |        |        | [20,20,20,20,20] |
| cols | 元素列长度集合（以px为单位） | array | 是       |        |        | [20,20,20,20,20] |
|      |                              |       |          |        |        |                  |
|      |                              |       |          |        |        |                  |
### 元素slot参数

| 参数     | 说明               | 类型    |
| -------- | ------------------ | ------- |
| rowIndex | 元素在行集合的位置 | number  |
| colIndex | 元素在列集合的位置 | number  |
| height   | 元素高度           | number  |
| width    | 元素宽度           | number  |
| active   | 元素激活状态       | Boolean |



