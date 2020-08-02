import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sidebar: false,
    api: '',
    token: localStorage.getItem('ACCESS_TOKEN') || null,
    username: localStorage.getItem('username') || null,
    cart: [],
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
    },

    REMOVE_PRODUCT(state, index) {
      if(state.cart[index].qty > 1) {
        state.cart[index].qty --;
      } else {
        state.cart.splice(index, 1);
      }
    },

    INCRES_QTY(state, index) {
      state.cart[index].qty++
    },

    DECRES_QTY(state, index) {
      state.cart[index].qty--
    },

    REMOVE_PRODUCT_CART_PAGE(state, index) {
      state.cart.splice(index, 1);
    }
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
    }
  },

  actions: {
    // user login method
    loginProccess(context, payload) {
      return new Promise((resolve, reject) => {
        axios.post('loginUser', payload)
        .then((data) => {
          context.commit('USER_LOGIN', data.data.token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;
          localStorage.setItem('ACCESS_TOKEN', data.data.token);
          resolve(data)
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
          localStorage.removeItem('ACCESS_TOKEN');
          localStorage.removeItem('username');
          resolve(true)
        } else {
          reject('Your Allready Logged out');
        }
      })
    },

    // get product method
    productsMethod(context, api) {
      return new Promise((resolve, reject) => {
        context.commit('SET_API', api)
        axios.get(`${this.state.api}`)
        .then(data => {
          resolve(data.data);
        }).catch(err => {
          reject(err)
        })
      })
    },

    // add item to cart
    additemToCart({commit}, {product, qty}) {
      commit('SAVE_PRODUCT', {product, qty});
    },

    removeItemFromCart({commit}, index) {
      commit('REMOVE_PRODUCT', index);
    },

    removeItemFromCartPage({commit}, index) {
      commit('REMOVE_PRODUCT_CART_PAGE', index);
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
