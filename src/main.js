import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VueMeta from 'vue-meta'
import '@/assets/css/font.css'
import '@/assets/css/iconmonstr-iconic-font.min.css'
import axios from 'axios'
import VueAxios from 'vue-axios'


Vue.use(VueAxios, axios)
Vue.use(VueMeta)

axios.defaults.baseURL = 'http://localhost:5000/api/';
axios.defaults.headers.common['Authorization'] = '';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')