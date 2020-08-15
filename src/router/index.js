import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login'
import Register from '../views/Register'
import Cart from '../views/Cart'
import Profile from '../views/Profile'
import Category from '../views/Category'
import Product from '../views/Product'
import Invoice from '../views/Invoice'
import Verify from '../views/Verify'
import PageNotFound from '../views/PageNotFound'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      requiresVisitor: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      requiresVisitor: true
    }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      requiresVisitor: true
    }
  },
  {
    path: '/cart',
    name: 'cart',
    component: Cart,
    meta: {
      requiresVisitor: true
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: {
      requiresVisitor: true
    }
  },
  {
    path: '/category/:id',
    name: 'category',
    component: Category,
    meta: {
      requiresVisitor: true
    }
  },
  {
    path: '/product/:id',
    name: 'product',
    component: Product,
    meta: {
      requiresVisitor: true
    }
  },
  {
    path: '/invoice/:id',
    name: 'invoice',
    component: Invoice,
    meta: {
      requiresVisitor: true
    }
  },
  {
    path: '/verify/:code',
    name: 'verify',
    component: Verify,
    meta: {
      requiresVisitor: true
    }
  },
  {
    path: '*',
    name: 'PageNotFound',
    component: PageNotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
