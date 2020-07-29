import virtualScroller from './components/virtual-scroller.vue';
import virtualScrollerTable from './components/virtual-scroller-table'
const plugin = {
    install(Vue, options) {
        const finalOptions = Object.assign({ refix: '', options })
        Vue.component(`${finalOptions.refix}virtualScroller`, virtualScroller);
        Vue.component(`${finalOptions.refix}virtualScrollerTable`, virtualScrollerTable)
    },
};
export default plugin;
