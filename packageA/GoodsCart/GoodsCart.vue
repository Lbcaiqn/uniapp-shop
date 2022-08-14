<template>
    <view id="GoodsCart" @clickSearch="toSearch">
        <my-search @clickSearch="toSearch" class="search" />
        <view class="goods-cart" v-if="data?.goods?.length != 0">
            <view 
            class="goods-cart-item" 
            v-for="i in data?.goods" 
            :key="i.goods_id" 
            @click="toGoodsDetail(i.goods_id)"
            >
                <view class="goods-image">
                    <image v-if="i?.goods_small_logo" :src="i.goods_small_logo" mode="widthFix"></image>
                    <image v-else src="../../static/null.png" mode="widthFix"></image>
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

function toSearch(){
    uni.navigateTo({url:'/packageA/Search/Search'})
}

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
.search {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
}
.goods-cart {
    margin: 3vw;
    margin-top: 12vh;
    .goods-cart-item {
        display: flex;
        margin: 3vw 0;
        height: 23vw;;
        .goods-image {
            display: flex;
            align-items: center;
            width: 30%;
            overflow: hidden;
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
            font-size: 4vw;
            >view {
                overflow: hidden;  
                text-overflow: ellipsis;
                display: -webkit-box; 
                -webkit-line-clamp: 3; 
                -webkit-box-orient: vertical;
            }
            .goods-message-price {
                height: 4.2vw;
                line-height: 4.2vw;
                font-weight: bold;
                color: red;
                
            }
        }
    }
}


</style>
