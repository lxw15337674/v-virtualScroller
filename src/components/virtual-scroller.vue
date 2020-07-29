<template>
    <div
        class="dynamicScroller"
        :class="{ [`direction-${direction}`]: true }"
        ref="scroller"
        @scroll.passive="handleScroll"
    >
        <!-- <slot name="before"></slot> -->
        <div class="wrapper" ref="wrapper" :style="tableSize">
            <div
                class="item-view"
                :class="direction"
                v-for="view of pool"
                :key="view.id"
                :style="{
                    transform: `translate${direction === 'vertical' ? 'Y' : 'X'}(${
                        view.position
                    }px)`,
                }"
            >
                <slot :size="view.item" :index="view.index" :active="view.used"></slot>
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
    name: 'dynamicScroller',
    props: {
        items: {
            type: Array,
            require: true,
            default: [],
        },
        direction: {
            type: String,
            default: 'vertical',
            validator: (value) => ['vertical', 'horizontal'].includes(value),
        },
    },
    data() {
        return {
            pool: [],
            visibleIndex: {
                start: -1,
                end: -1,
            },
        };
    },
    methods: {
        usedView(viewIndex, itemsIndex) {
            let view = {},
                { items, itemsPosition } = this;
            if (this.pool[viewIndex]) {
                view = this.pool[viewIndex];
                view.item = items[itemsIndex];
                view.index = itemsIndex;
                view.used = true;
                view.position = itemsPosition[itemsIndex - 1] || 0;
            } else {
                view = {
                    item: this.items[itemsIndex],
                    position: itemsPosition[itemsIndex - 1] || 0,
                    index: itemsIndex,
                    id: uid++,
                    used: true,
                };
                this.pool.push(view);
            }
            return view;
        },
        unusedView(view) {
            view.used = false;
            view.position = -9999;
        },
        updateVisibleItems() {
            let { start, end } = this.visibleIndex;
            let viewIndex = 0;
            //更新使用的view
            for (let i = start; i <= end; i++) {
                this.usedView(viewIndex, i);
                viewIndex++;
            }
            // 处理不使用的view
            for (let i = viewIndex; i < this.pool.length; i++) {
                this.unusedView(this.pool[i]);
            }
        },
        handleScroll() {
            if (this.direction === 'vertical') {
                this.handleVisibilityChange(
                    this.$refs.scroller.scrollTop,
                    this.$refs.scroller.clientHeight,
                );
            } else {
                this.handleVisibilityChange(
                    this.$refs.scroller.scrollLeft,
                    this.$refs.scroller.clientWidth,
                );
            }
        },
        handleVisibilityChange(offset, clientSize) {
            let { start, end } = scroll.findVisibleIndex(offset, clientSize, this.itemsPosition);
            this.visibleIndex.start = start;
            this.visibleIndex.end = end;
            this.updateVisibleItems();
        },
    },
    watch: {
        items: {
            deep: true,
            handler() {
                this.handleScroll();
            },
        },
    },
    computed: {
        tableSize() {
            if (this.direction === 'vertical') {
                return {
                    minHeight: `${math.total(this.items, 0, -1)}px`,
                    width: '100%',
                };
            } else {
                return {
                    height: '100%',
                    minWidth: `${math.total(this.items, 0, -1)}px`,
                };
            }
        },
        //尺寸缓存
        itemsPosition() {
            let total = 0;
            return this.items.map((item) => {
                total += item;
                return total;
            });
        },
    },
    mounted() {
        window.addEventListener('resize', this.handleScroll);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.handleScroll);
    },
};
</script>

<style lang="stylus" scoped>
.dynamicScroller
    position relative;
    height 100%
    width 100%
    .item-view
        will-change transform;
        position absolute;
        top 0;
        left 0;
.direction-horizontal
    overflow-x auto
    display: flex;
.direction-vertical
    overflow-y auto
</style>
