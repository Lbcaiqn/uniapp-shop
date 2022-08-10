<template>
    <view id="Shopcart" v-if="shopcartStore.getListSum != 0">
        <my-address />
        <view class="shopcart-title">
            <view><uni-icons type="shop" size="18"></uni-icons></view>
            <view>购物车</view>
        </view>
        <view class="shopcart-message" v-if="shopcartStore?.list?.length != 0">
        <uni-swipe-action>
            <uni-swipe-action-item 
            :right-options="options" 
            @click="deleteGoods(id)" 
            v-for="(i,id) in shopcartStore?.list"
            :key="id" 
            >
                <view class="shopcart-message-item">
                    <view class="shopcart-message-item-radio" @click="radioClick(id)"><radio :checked="i.isSelect" color="red"></radio></view>
                    <view class="shopcart-message-item-content">
                        <view class="shopcart-message-item-content-image" @click="toGoodsDetail(id)"><image mode="widthFix" :src="i?.goods_small_logo"></image></view>
                        <view class="shopcart-message-item-content-text">
                            <view @click="toGoodsDetail(id)">{{i?.goods_name}}</view>
                            <view class="price-and-sum">
                                <view class="price">￥{{i?.goods_price ? Number(i?.goods_price).toFixed(2) : 0}}</view>
                                <view class="sum">
                                    <uni-number-box @change="sumChange($event,id)" :min="1" :value="i?.sum"></uni-number-box>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </uni-swipe-action-item>
        </uni-swipe-action>
        </view>
        
        <view class="buy">
            <view class="buy-box">
                <view class="radio" @click="selectAll"><radio :checked="shopcartStore.isSelectSum() == shopcartStore.getListSum" color="red"></radio></view>
                <view class="radio-text">全选</view>
                <view class="price">总计：￥{{shopcartStore.totalPrice().toFixed(2)}}元</view>
                <view class="to-buy"><view class="to-buy-box">结算</view></view>.
            </view>
        </view>
        
    </view>
    <view class="null-shopcart" v-else>
        <view class="null-shopcart-image">
            <view><image src="../../static/null-shopcart.png" mode="widthFix"></image></view>
        </view>
        <view class="null-shopcart-text">购物车还没有商品，快去选购吧！</view>
    </view>
</template>

<script setup>
import {ref,reactive} from 'vue'
import useBadge from '../../hooks/useBadge.js'
useBadge()
import {ShopcartStore} from '../../store/index.js'
const shopcartStore = ShopcartStore()

const options = [{
    text: '删除',
    style: {
        backgroundColor: 'red'
    }
}]

function clearShopcartData(){
    uni.setStorageSync('shopcartData',JSON.stringify({}))
    shopcartStore.list = {}
    uni.setTabBarBadge({
        index: 2,
        text: ''
    })
}

function radioClick(id){
    shopcartStore.list[id].isSelect = !shopcartStore.list[id].isSelect
    uni.setStorageSync('shopcartData',JSON.stringify(shopcartStore.list))
    uni.setTabBarBadge({
        index: 2,
        text: shopcartStore.isSelectSum() + '' == '0' ? '' : shopcartStore.isSelectSum() + ''
    })
}

function sumChange(e,id){
    shopcartStore.list[id].sum = e
    uni.setStorageSync('shopcartData',JSON.stringify(shopcartStore.list))
    
}
function toGoodsDetail(id){
    uni.navigateTo({
        url: '/packageA/GoodsDetail/GoodsDetail?goods_id=' + id
    })
}
function deleteGoods(id){
    delete shopcartStore.list[id]
    uni.setStorageSync('shopcartData',JSON.stringify(shopcartStore.list))
    uni.setTabBarBadge({
        index: 2,
        text: shopcartStore.isSelectSum() + '' == '0' ? '' : shopcartStore.isSelectSum() + ''
    })
}

function selectAll(){
    if(shopcartStore.isSelectSum() != shopcartStore.getListSum){
        for(let i in shopcartStore.list)    shopcartStore.list[i].isSelect = true
    }
    else {
        for(let i in shopcartStore.list)    shopcartStore.list[i].isSelect = false
    }
    uni.setStorageSync('shopcartData',JSON.stringify(shopcartStore.list))
    uni.setTabBarBadge({
        index: 2,
        text: shopcartStore.isSelectSum() + '' == '0' ? '' : shopcartStore.isSelectSum() + ''
    })
}
</script>

<style scoped lang="less">
.shopcart-title, .shopcart-message {
    margin: 3vw;
}
.shopcart-title {
    display: flex;
    font-size: 4vw;
    >view:last-child {
        margin-left: 3vw;
    }
}
.shopcart-message {
    margin: 3vw;
    margin-bottom: 44px;
    .shopcart-message-item {
        display: flex;
    
        .shopcart-message-item-radio {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 10%;
        }
        .shopcart-message-item-content {
            display: flex;
            width: 90%;
            .shopcart-message-item-content-image {
                width: 30.5%;
                
                image {
                    width: 100%;
                }
            }
            .shopcart-message-item-content-text {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                width: 69.5%;
                padding: 0 2vw;
                font-size: 3.5vw;
                .price-and-sum {
                    display: flex;
                    justify-content: space-between;
                    .price {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-weight: bold;
                        font-size: 4.5vw;
                        color: red;
                    }
                }
            }
        }
        
    }
}

.buy {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: 4vw;
    border-top: 1px solid red;
    background-color: #fff;
    .buy-box {
        margin: 0 3vw;
        display: flex;
        .radio {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 10%;
        }
        .radio-text {
            width: 10%;
        }
        .price {
            flex: 1;
            font-weight: bold;
            color: red;
        }
        .to-buy {
            width: 25%;
            display: flex;
            justify-content: center;
            align-items: center;
            .to-buy-box {
                width: 100%;
                color: #fff;
                height: 40px;
                line-height: 40px;
                border-radius: 4vw;
                background-color: red;
            }
            
        }
    }
}

.null-shopcart {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 100%;
    font-size: 5vw;
    text-align: center;
    image {
        width: 100%;
    }
    .null-shopcart-image {
        display: flex;
        justify-content: center;
        align-items: center;
        >view {
            width: 50%;
        }
    }
    .null-shopcart-text {
        margin-top: 5vw;
    }
}
</style>
