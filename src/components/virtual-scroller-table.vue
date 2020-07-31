<template>
    <div class="dynamicScroller" ref="scroller" @scroll.passive="handleScroll">
        <slot name="before"></slot>
        <div class="wrapper" :style="tableSize">
            <div
                v-for="row of rowsPool"
                :key="row.id"
                class="row-view"
                :style="{
                    transform: `  translate(0,${row.position}px)`,
                }"
            >
                <div
                    v-for="col of colsPool"
                    :key="col.id"
                    :style="{
                        transform: `  translate(${col.position}px,0)`,
                    }"
                    class="col-view"
                >
                    <slot
                        :rowIndex="row.index"
                        :colIndex="col.index"
                        :height="row.item"
                        :width="col.item"
                        :active="col.used"
                    ></slot>
                </div>
            </div>
        </div>
        <!-- <slot name="after"></slot> -->
    </div>
</template>
<script>
import * as scroll from '../utils/scroll.ts';
import * as math from '../utils/math.ts';
let uid = 0;
export default {
    name: 'virtual-scroller-table',
    props: {
        cols: {
            type: Array,
            require: true,
        },
        rows: {
            type: Array,
            require: true,
        },
    },
    components: {},
    data() {
        return {
            rowsPool: [],
            colsPool: [],
            visibleRowsIndex: {
                start: -1,
                end: -1,
            },
            visibleColsIndex: {
                start: -1,
                end: -1,
            },
        };
    },
    methods: {
        usedView(pool, viewIndex, items, itemsIndex, itemPosition) {
            let view = {};
            if (pool[viewIndex]) {
                view = pool[viewIndex];
                view.item = items[itemsIndex];
                view.index = itemsIndex;
                view.used = true;
                view.position = itemPosition?.[itemsIndex - 1] ?? 0;
            } else {
                view = {
                    item: items[itemsIndex],
                    position: itemPosition?.[itemsIndex - 1] ?? 0,
                    index: itemsIndex,
                    id: uid++,
                    used: true,
                };
                pool.push(view);
            }
            return view;
        },
        unusedView(view) {
            view.used = false;
            view.position = -9999;
        },
        updateVisibleItems(direction) {
            let start, end, pool, itemPosition, items;
            if (direction === 'vertical') {
                start = this.visibleRowsIndex.start;
                end = this.visibleRowsIndex.end;
                pool = this.rowsPool;
                itemPosition = this.rowsPosition;
                items = this.rows;
            } else {
                start = this.visibleColsIndex.start;
                end = this.visibleColsIndex.end;
                pool = this.colsPool;
                itemPosition = this.colsPosition;
                items = this.cols;
            }
            let viewIndex = 0;
            //更新使用的view
            for (let i = start; i <= end; i++) {
                this.usedView(pool, viewIndex, items, i, itemPosition);
                viewIndex++;
            }
            // 处理不使用的view
            for (let i = viewIndex; i < pool.length; i++) {
                this.unusedView(pool[i]);
            }
        },
        handleScroll() {
            let scroller = this.$refs.scroller;
            this.$emit('scroll', { left: scroller.scrollLeft, top: scroller.scrollTop });
            this.handleVisibilityChange();
        },
        handleVisibilityChange() {
            let scroller = this.$refs.scroller;
            this.visibleRowsIndex = scroll.findVisibleIndex(
                scroller.scrollTop,
                scroller.clientHeight,
                this.rowsPosition,
            );
            this.visibleColsIndex = scroll.findVisibleIndex(
                scroller.scrollLeft,
                scroller.clientWidth,
                this.colsPosition,
            );
        },
    },

    watch: {
        visibleRowsIndex: {
            deep: true,
            handler() {
                this.updateVisibleItems('vertical');
            },
        },
        visibleColsIndex: {
            deep: true,
            handler() {
                this.updateVisibleItems('horizontal');
            },
        },
        table: {
            deep: true,
            handler() {
                console.log('test');
                this.handleVisibilityChange();
            },
        },
    },
    computed: {
        table() {
            return { cols: this.cols, rows: this.rows };
        },
        tableSize() {
            return {
                height: `${math.total(this.rows, 0, -1)}px`,
                width: `${math.total(this.cols, 0, -1)}px`,
            };
        },
        //长度缓存
        colsPosition() {
            let total = 0;
            return this.cols.map((item) => {
                total += item;
                return total;
            });
        },
        //高度缓存
        rowsPosition() {
            let total = 0;
            return this.rows.map((item) => {
                total += item;
                return total;
            });
        },
    },
    mounted() {
        window.addEventListener('resize', this.handleVisibilityChange);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.handleVisibilityChange);
    },
};
</script>

<style lang="stylus" scoped>
.dynamicScroller
    position relative;
    height 100%
    width 100%
    overflow auto
    .col-view
        will-change: transform;
        position: absolute;
        top: 0;
        left: 0;
    .col-view,.row-view
        will-change: transform;
</style>
