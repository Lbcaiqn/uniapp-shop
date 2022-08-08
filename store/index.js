import {createPinia,defineStore} from 'pinia'
const pinia = createPinia()

const ShopcartStore = defineStore('Shopcart',{
  state(){
    return {
      list: uni.getStorageSync('shopcartData') == '' ? {} : JSON.parse(uni.getStorageSync('shopcartData'))
    }
  },
  getters: {
      getListSum(){
          return Object.keys(this.list).length >= 100 ? '99+' : Object.keys(this.list).length
      }
  },
  actions: {
      
  }
})

export {
  pinia,
  ShopcartStore
}