import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false

const v = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})

Vue.use(v)
