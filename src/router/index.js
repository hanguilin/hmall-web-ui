import Vue from 'vue'
import Router from 'vue-router'
import { userInfo } from '@/api'
import { getStore } from '@/utils/storage'
import store from '@/store'
// 开发环境不使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

const Index = _import('index')
const Login = _import('Login/login')
const Register = _import('Login/register')
const Home = _import('Home/home')
const GoodS = _import('Goods/goods')
const goodsDetails = _import('Goods/goodsDetails')
const Cart = _import('Cart/cart')
const order = _import('Order/order')
const user = _import('User/user')
const orderList = _import('User/children/order')
const information = _import('User/children/information')
const addressList = _import('User/children/addressList')
const coupon = _import('User/children/coupon')
const aihuishou = _import('User/children/aihuishou')
const support = _import('User/children/support')
const checkout = _import('Checkout/checkout')
const payment = _import('Order/payment')
const paysuccess = _import('Order/paysuccess')
const Thanks = _import('Thanks/thanks')
const Search = _import('Search/search')
const RefreshSearch = _import('Refresh/refreshsearch')
const RefreshGoods = _import('Refresh/refreshgoods')
const orderDetail = _import('User/children/orderDetail')
const Alipay = _import('Order/alipay')
const Wechat = _import('Order/wechat')
const QQpay = _import('Order/qqpay')
Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      component: Index,
      name: 'index',
      redirect: '/home',
      children: [
        {path: 'home', component: Home},
        {path: 'goods', component: GoodS},
        {path: 'goodsDetails', name: 'goodsDetails', component: goodsDetails},
        {path: 'thanks', name: 'thanks', component: Thanks},
        {path: '/refreshgoods', name: 'refreshgoods', component: RefreshGoods}
      ]
    },
    {path: '/login', name: 'login', component: Login},
    {path: '/register', name: 'register', component: Register},
    {path: '/cart', name: 'cart', component: Cart},
    {path: '/refreshsearch', name: 'refreshsearch', component: RefreshSearch},
    {
      path: '/order',
      name: 'order',
      component: order,
      children: [
        {path: 'paysuccess', name: 'paysuccess', component: paysuccess},
        {path: 'payment', name: 'payment', component: payment},
        {path: '/search', name: 'search', component: Search},
        {path: 'alipay', name: 'alipay', component: Alipay},
        {path: 'wechat', name: 'wechat', component: Wechat},
        {path: 'qqpay', name: 'qqpay', component: QQpay}
      ]
    },
    {
      path: '/user',
      name: 'user',
      component: user,
      redirect: '/user/orderList',
      children: [
        {path: 'orderList', name: '订单列表', component: orderList},
        {path: 'orderDetail', name: '订单详情', component: orderDetail},
        {path: 'information', name: '账户资料', component: information},
        {path: 'addressList', name: '收货地址', component: addressList},
        {path: 'coupon', name: '我的优惠', component: coupon},
        {path: 'support', name: '售后服务', component: support},
        {path: 'aihuishou', name: '以旧换新', component: aihuishou}
      ]
    },
    {path: '/checkout', name: 'checkout', component: checkout},
    {path: '*', redirect: '/home'}
  ]
})

// 不需要登录的页面
const whiteList = ['/home', '/goods', '/login', '/register', '/goodsDetails', '/thanks', '/search', '/refreshsearch', '/refreshgoods']
router.beforeEach(function (to, from, next) {
  let params = {
    params: {
      token: getStore('token')
    }
  }
  // 白名单中
  if (whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    userInfo(params).then(res => {
      let data = res.data
      // 未找到登录用户
      if (res.code !== 0) {
        next('/login')
      } else {
        // 已登录
        store.commit('RECORD_USERINFO', {info: data})
        if (to.path === '/login') { //  跳转到
          next({path: '/'})
        }
        next()
      }
    })
  }
})
export default router
