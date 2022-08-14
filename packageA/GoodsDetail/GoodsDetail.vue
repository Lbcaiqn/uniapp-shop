<template>
    <view id="GoodsDetail">
        <view class="goods-swiper">
            <swiper v-if="data?.goods?.pics?.length != 0" autoplay circular interval="3000" style="height:50vh;width: 100%;">
                <swiper-item class="image-box" v-for="(i,iIndex) in data?.goods?.pics" :key="i?.pics_id" style="height:50vh;width: 100%;">
                    <image :src="i?.pics_big" mode="widthFix" @click="previewImage(iIndex)"></image>
                </swiper-item>
            </swiper>
            <view v-else class="image-box"><image src="../../static/null.png" mode="widthFix"></image></view>
        </view>
        
        <view class="goods-message">
            <view class="goods-price">￥{{data?.goods?.goods_price ? Number(data?.goods?.goods_price).toFixed(2) : 0}}</view>
            <view class="goods-title">
                <view class="goods-title-text">{{data?.goods?.goods_name}}</view>
                <view class="goods-title-star">
                    <view v-if="!isStar" @click="star">
                        <view><uni-icons type="star" size="25" color="gray"></uni-icons></view>
                        <view>收藏</view>
                    </view>
                    <view v-else @click="star">
                        <view><uni-icons type="star-filled" size="25" color="red"></uni-icons></view>
                        <view style="color: red;">收藏</view>
                    </view>
                </view>
            </view>
            <view class="goods-yunfei">快递：免运费</view>
            <view class="goods-detail">
                <rich-text :nodes="data?.goods?.goods_introduce"></rich-text>
            </view>
        </view>
        
        <view class="goods-tab-bar">
            <uni-goods-nav 
            :fill="true" 
            :options="goodsTabBarData.options"
            :buttonGroup="goodsTabBarData.buttonGroup" 
            @click="optionsClick" 
            @buttonClick="buttonClick"
            ></uni-goods-nav>
        </view>
    </view>
</template>

<script setup>
import {ref,reactive} from 'vue'
import {onLoad} from '@dcloudio/uni-app'
import {ShopcartStore,UserStore} from '../../store/index.js'
const shopcartStore = ShopcartStore(), userStore = UserStore()
let goods_id = ''
let data = reactive({})
onLoad((options) => {
    goods_id = options.goods_id
    uni.$http.get('/api/public/v1/goods/detail',{goods_id}).then(res => {
        if(res.data.meta.status != 200){
            uni.$showToast()
            return
        }
        else {
            data.goods = res.data.message
            data.goods.goods_introduce = data.goods.goods_introduce.replace(/<img /g,'<img style="display:block;" ').replace(/webp/g,'jpg')
            console.log(data?.goods?.pics)
        }
    })
})

function previewImage(i){
    uni.previewImage({
        current: i,
        urls: data.goods.pics.map(x => x.pics_big)
    })
}

let isStar = ref(false)
function star(){
    isStar.value = !isStar.value
}

let goodsTabBarData = reactive({
    options: [
        {icon: 'shop',text: '店铺'},
        {icon: 'cart',text: '购物车',info: shopcartStore.isSelectSum()}
    ],
    buttonGroip: [
        {text: '加入购物车',backgroundColor: 'red', color: 'Efff'},
        {text: '立即购买',backgroundColor: 'ffa200', color: 'Efff'}
    ]
})
function optionsClick(e){
    if(e.content.text == '购物车'){
        uni.switchTab({
            url: '/pages/Shopcart/Shopcart'
        })
    }
}
function buttonClick(e){
    if(e.content.text == '加入购物车' && data?.goods?.goods_id){
        if(shopcartStore.list[data.goods.goods_id]){
            shopcartStore.list[data.goods.goods_id].sum++
        }
        else {
            shopcartStore.list[data.goods.goods_id] = {
                goods_id: data.goods.goods_id,
                goods_name: data.goods.goods_name,
                goods_price: data.goods.goods_price,
                goods_small_logo: data.goods.goods_small_logo,
                sum: 1,
                isSelect: true
            }
        }
        uni.setStorageSync('shopcartData',JSON.stringify(shopcartStore.list))
        goodsTabBarData.options[1].info = shopcartStore.isSelectSum()
    }
    else if(e.content.text == '立即购买' && data?.goods?.goods_id){
        let n = 3
        if(userStore.token == ''){
            uni.showToast({
                title: `请先登录，${n}秒后自动跳转到登录页`,
                duration: 1000,
                icon: 'none',
                make: true
            })
            let timer = setInterval(() => {
                if(n <= 0){
                    userStore.loginFrom.url = '/packageA/GoodsDetail/GoodsDetail?goods_id='+data?.goods?.goods_id
                    userStore.loginFrom.openType = 'navigateTo'
                    uni.switchTab({
                        url: '/pages/Profile/Profile'
                    })
                    clearInterval(timer)
                    return
                }
                else {
                    n--
                    uni.showToast({
                        title: `请先登录，${n}秒后自动跳转到登录页`,
                        duration: 1000,
                        icon: 'none',
                        mask: true,
                    })
                }
            },1000)
        }
        else {
           uni.showModal({
               title: '提示',
               content: '支付功能尚在开发中',
               confirmText: '我知道了',
               showCancel: false
           })
        }
    }
}
</script>

<style scoped lang="less">
.goods-swiper {
    height: 50vh;
    .image-box {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50vh;
    }
    image {
        width: 100%;
    }
}
.goods-message {
    margin: 3vw;
    margin-bottom: 20vw;
    .goods-price {
        color: red;
        font-size: 7vw;
        font-weight: bold;
    }
    .goods-title {
        display: flex;
        margin-top: 3vw;
        font-size: 4.5vw;
        font-weight: bold;
        .goods-title-text {
            width: 90%;
        }
        .goods-title-star {
            width: 10%;
            display: flex;
            justify-content: center;
            align-items: center;
            >view>view:last-child {
                font-size: 3vw;
            }
        }
    }
    .goods-yunfei {
        margin-top: 3vw;
        font-size: 3vw;
        color: gray;
    }
    .goods-detail {
        margin-top: 15vw;
    }
}
.goods-tab-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
}
</style>
