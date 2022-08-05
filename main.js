import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
//https://applet-base-api-t.itheima.net/docs-uni-shop/3.home.html#_3-1-%E9%85%8D%E7%BD%AE%E7%BD%91%E7%BB%9C%E8%AF%B7%E6%B1%82

//挂载到uni，可以使用拦截器，里面调用微信小程序的api
import {$http} from '@escook/request-miniprograM'
$http.baseUrl = 'https://api-hmugo-web.itheima.net'
//请求拦截器
$http.beforeRequest = (opt) => {
  uni.showLoading({
    title: '加载中...'
  })
}
//响应拦截器
$http.afterRequest = (res) => {
  uni.hideLoading()
}
uni.$http = $http

uni.$showToast = (title='网络异常',duration=2000,icon='none') => {
    uni.showToast({
        title,
        duration,
        icon
    })
}
