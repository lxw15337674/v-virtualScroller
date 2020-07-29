import virtualScroller from './components/virtual-scroller.vue';
import virtualScrollerTable from './components/virtual-scroller-table'
export {
    virtualScroller,
    virtualScrollerTable
}
const plugin = {
    install(Vue, prefix = '') {
        Vue.component(`${prefix}VirtualScroller`, virtualScroller);
        Vue.component(`${prefix}VirtualScrollerTable`, virtualScrollerTable)
    },
};
export default plugin;
