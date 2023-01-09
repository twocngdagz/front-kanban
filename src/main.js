import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
import store from './store/index'
import VModal from 'vue-js-modal'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowsUpDownLeftRight } from '@fortawesome/free-solid-svg-icons'
library.add(faArrowsUpDownLeftRight)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VModal)

new Vue({
    store,
    render: h => h(App),
}).$mount('#app')
