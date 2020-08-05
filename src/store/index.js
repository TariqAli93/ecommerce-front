import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

let cart = localStorage.getItem('cart');

export default new Vuex.Store({
  state: {
    sidebar: false,
    api: '',
    token: localStorage.getItem('ACCESS_TOKEN') || sessionStorage.getItem('ACCESS_TOKEN') || null,
    username: localStorage.getItem('username') || sessionStorage.getItem('username') || null,
    cart: cart ? JSON.parse(cart) : [],
  },
  
  mutations: {
    USER_LOGIN(state, token) {
      return state.token = token
    },

    LOGOUT(state) {
      return state.token = null
    },

    SET_API(state, api) {
      state.api = api
    },

    SAVE_PRODUCT(state, {product, qty}) {
      let itemInCart = state.cart.find(item => {
        return item.product.idProduct === product.idProduct
      });

      if(itemInCart) {
        itemInCart.qty += qty
      } else {
        state.cart.push({product, qty});
      }

      localStorage.setItem('cart', JSON.stringify(state.cart));
    },

    REMOVE_PRODUCT(state, index) {
      state.cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },

    INCRES_QTY(state, index) {
      state.cart[index].qty++
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },

    DECRES_QTY(state, index) {
      state.cart[index].qty--
      if(state.cart[index].qty < 1) {
        state.cart[index].qty = 1;
      }
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
  },
  
  getters: {
    isLoggedIn(state) {
      return state.token !== null
    },
    
    username(state) {
      return state.username
    },

    product_count(state) {
      return state.cart.length;
    },

    totalPrice(state) {
      let total = 0;

      state.cart.forEach(item => {
        total += item.product.price * item.qty
      })

      return total
    },
  },

  actions: {
    // user login method
    loginProccess(context, payload) {
      return new Promise((resolve, reject) => {
        axios.post('loginUser', payload)
        .then((data) => {
          context.commit('USER_LOGIN', data.data.token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;
          resolve(data.data)
        })
        .catch((error) => {
          reject(error)
        })
      })
    },

    // user logout methods
    userLogout(context) {
      return new Promise((resolve, reject) => {
        if(this.state.token !== null || this.state.token !== '') {
          context.commit('LOGOUT');
          let session = sessionStorage.getItem('ACCESS_TOKEN');

          if(session) {
            sessionStorage.removeItem('ACCESS_TOKEN');
            sessionStorage.removeItem('username');
          } else {
            localStorage.removeItem('ACCESS_TOKEN');
            localStorage.removeItem('username');
          }
          resolve(true)
        } else {
          reject('Your Allready Logged out');
        }
      })
    },

    // add item to cart
    additemToCart({commit}, {product, qty}) {
      commit('SAVE_PRODUCT', {product, qty});
    },

    removeItemFromCart({commit}, index) {
      commit('REMOVE_PRODUCT', index);
    },

    countUpQty({commit}, index) {
      commit('INCRES_QTY', index);
    },

    countDownQty({commit}, index) {
      commit('DECRES_QTY', index);
    },
  },
  modules: {
  }
})