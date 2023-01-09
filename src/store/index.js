import Vue from 'vue'
import Vuex from 'vuex'

import column from './modules/column'

Vue.use(Vuex)

window.axios = require('axios');

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export default new Vuex.Store({
    modules: {
        column
    }
})
