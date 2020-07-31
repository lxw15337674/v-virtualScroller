<template>
    <div class="app">
        <button @click="addData">填充数据</button>
        <h1>垂直滚动</h1>
        <div class="vertical">
            <virtual-scroller :items="items" @scroll="scrollHandle">
                <template v-slot="{ index, size, active }">
                    <div>{{ index }}{{ size }} {{ active }}</div>
                </template>
            </virtual-scroller>
        </div>
        <h1>水平滚动</h1>
        <div class="horizontal">
            <virtual-scroller
                :items="items"
                v-slot="{ index, size, active }"
                direction="horizontal"
            >
                <div>{{ index }}{{ size }} {{ active }}</div>
            </virtual-scroller>
        </div>
        <h1>虚拟滚动表格</h1>
        <div class="table">
            <virtual-scroller-table
                :cols="items"
                :rows="items"
                v-slot="{ rowIndex, colIndex, active }"
            >
                <div>{{ colIndex }}{{ colIndex }} {{ active }}</div>
            </virtual-scroller-table>
        </div>
    </div>
</template>

<script>
import * as math from '@/utils/math.ts';
export default {
    name: 'App',
    data() {
        return {
            items: [],
        };
    },
    methods: {
        scrollHandle(offset) {
            console.log(offset);
        },
        addData() {
            for (let i = 0; i < 1000; i++) {
                this.items.push(math.random(50, 200));
            }
        },
    },
    mounted() {},
};
</script>

<style lang="stylus" scoped>
.vertical
  height 30vh
.horizontal
  width 100%
  height 10vh
.table
  width 50vh
  height 30vh
</style>
