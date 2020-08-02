import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import ar from 'vuetify/es5/locale/ar';
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify);

Vuetify.config.silent = true

export default new Vuetify({
  rtl: true,
  theme: {
      options: {
        customProperties: true,
      },
    themes: {
      light: {
        primary: '#0197F4',
        secondary: '#13293D',
        accent: '#9CF6F6',
        error: '#DB575B',
        info: '#388697',
        success: '#5BD79D',
        warning: '#E58124'
      },
    },
  },
    lang: {
      locales: { ar },
      current: 'ar',
    },
  icons: {
    iconfont: 'fa4',
  },
});
