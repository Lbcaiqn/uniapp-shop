<template>
    <view id="GoodsCart">
        <view class="goods-cart" v-if="data?.goods?.length != 0">
            <view 
            class="goods-cart-item" 
            v-for="i in data?.goods" 
            :key="i.goods_id" 
            @click="toGoodsDetail(i.goods_id)"
            >
                <view class="goods-image">
                    <image v-if="i?.goods_small_logo" :src="i.goods_small_logo" mode="widthFix"></image>
                    <image v-else="i?.goods_small_logo" src="https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png" mode="widthFix"></image>
                </view>
                <view class="goods-message">
                    <view class="goods-message-name">{{i.goods_name}}</view>
                    <view class="goods-message-price">￥{{Number(i.goods_price).toFixed(2)}}</view>
                </view>
            </view>
        </view>
        
    </view>
</template>

<script setup>
import {ref,reactive} from 'vue'
import {onLoad,onReachBottom,onPullDownRefresh} from '@dcloudio/uni-app'
let queryData = {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
    
}
let data = reactive({
    total: 0,
    goods: []
})

onLoad((options) => {
    queryData.query = options.query || ''
    queryData.cid = options.cid || ''
    
    uni.$http.get('/api/public/v1/goods/search',queryData).then(res => {
        if(res.data.meta.status != 200){
            uni.$showToast()
            return
        }
        else {
            data.total = res.data.message.total
            data.goods = [...data.goods, ...res.data.message.goods]
            queryData.pagenum++
        }
    })
})
let flag = true
onReachBottom(() => {
    if((queryData.pagenum - 1) * queryData.pagesize >= data.total){
        uni.$showToast('没有更多了')
    }
    else {
        if(flag){
            flag = false
            uni.$http.get('/api/public/v1/goods/search',queryData).then(res => {
                if(res.data.meta.status != 200){
                    uni.$showToast()
                    return
                }
                else {
                    data.total = res.data.message.total
                    data.goods = [...data.goods, ...res.data.message.goods]
                    queryData.pagenum++
                    flag = true
                }
            })
        }
    }
})
onPullDownRefresh(() => {
    data.total = 0
    data.goods = []
    queryData.pagenum = 0
    flag = true
    uni.$http.get('/api/public/v1/goods/search',queryData).then(res => {
        if(res.data.meta.status != 200){
            uni.$showToast()
            return
        }
        else {
            data.total = res.data.message.total
            data.goods = [...data.goods, ...res.data.message.goods]
            queryData.pagenum++
        }
    })
    uni.stopPullDownRefresh()
})

function toGoodsDetail(id){
    uni.navigateTo({
        url: '/packageA/GoodsDetail/GoodsDetail?goods_id=' + id
    })
}
</script>

<style scoped lang="less">
.goods-cart {
    margin: 3vw;
    .goods-cart-item {
        display: flex;
        margin: 3vw 0;
        .goods-image {
            display: flex;
            align-items: center;
            width: 30%;
            image {
                width: 100%;
            }
        }
        .goods-message {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 0 3vw;
            width: 70%;
            font-size: 3.5vw;
            .goods-message-price {
                color: red;
            }
        }
    }
}


</style>
