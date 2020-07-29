import virtualScroller from './components/virtual-scroller.vue';
import virtualScrollerTable from './components/virtual-scroller-table'
export {
    virtualScroller,
    virtualScrollerTable
}
const plugin = {
    install(Vue, prefix = '') {
        Vue.component(`${prefix}virtualScroller`, virtualScroller);
        Vue.component(`${prefix}virtualScrollerTable`, virtualScrollerTable)
    },
};
export default plugin;
