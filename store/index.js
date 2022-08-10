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
      isSelectSum(){
          let sum = 0
          for(let i in this.list)
            if(this.list[i].isSelect)   sum++
         return sum
      },
      totalPrice(){
          let sum = 0
          for(let i in this.list)
            if(this.list[i].isSelect) sum += this.list[i].sum * Number(this.list[i].goods_price)
          return sum
      }
  }
})

const AddressStore = defineStore('AddressStore',{
  state(){
    return {
      address: uni.getStorageSync('addressData') == '' ? {} : JSON.parse(uni.getStorageSync('addressData'))
    }
  },
  getters: {
      fullAddress(){
          return this.address?.provinceName + this.address?.cityName + this.address?.countyName + this.address?.detailInfo
      }
  },
  actions: {
      
  }
})

export {
  pinia,
  ShopcartStore,
  AddressStore
}