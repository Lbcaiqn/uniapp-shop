<template>
    <view id="Profile">
        <view class="login" v-if="userStore.token == ''">
            <view><uni-icons type="contact-filled" :size="200" color="gray"></uni-icons></view>
            <view><button type="primary" open-type="getUserInfo" @click="login">微信登录</button></view>
        </view>
        <view class="user" v-else>
            <view class="message">
                <view>
                    <view><image :src="userStore?.userInfo?.avatarUrl" mode="widthFix"></image></view>
                    <view>{{userStore?.userInfo?.nickName}}</view>
                    
                </view>
            </view>
            <view class="content">
                <view class="data">
                        <view><view>0</view><view>收藏的店铺</view></view>
                        <view><view>0</view><view>收藏的商品</view></view>
                        <view><view>0</view><view>关注的商品</view></view>
                        <view><view>0</view><view>足迹</view></view>
                </view>
                <view class="buy-data-title">
                    <view>我的订单</view>
                    <view><uni-icons type="right" :size="18"></uni-icons></view>
                </view>
                <view class="buy-data">
                    <view><view><image src="../../static/profile/3.png" mode="widthFix"></image></view><view>待付款</view></view>
                    <view><view><image src="../../static/profile/1.png" mode="widthFix"></image></view><view>待收货</view></view>
                    <view><view><image src="../../static/profile/4.png" mode="widthFix"></image></view><view>待评价</view></view>
                    <view><view><image src="../../static/profile/2.png" mode="widthFix"></image></view><view>退货</view></view>
                </view>
                <view class="buy-data-title">
                    <view>收货地址</view>
                    <view><uni-icons type="right" :size="18"></uni-icons></view>
                </view>
                <view class="buy-data-title">
                    <view>联系客服</view>
                    <view><uni-icons type="right" :size="18"></uni-icons></view>
                </view>
            </view>
            <view><button class="off-login" @click="offLogin">退出登录</button></view>
        </view>
        
    </view>
</template>

<script setup>
import {ref} from 'vue'
import {UserStore} from '../../store/index.js'
const userStore = UserStore()
import useBadge from '../../hooks/useBadge.js'
useBadge()

function login(){
    uni.getUserProfile({desc:'123'}).then(res => {
        userStore.userInfo.avatarUrl = res.userInfo.avatarUrl
        userStore.userInfo.nickName = res.userInfo.nickName
        uni.login().then(res => {
            uni.showLoading({
              title: '加载中...'
            })
            setTimeout(() => {
                uni.hideLoading()
                userStore.token = res.code
                uni.setStorageSync('userInfoData',JSON.stringify(userStore.userInfo))
                uni.setStorageSync('token',userStore.token)
                
                if(userStore.loginFrom.url != ''){
                    if(userStore.loginFrom.openType == 'switchTab'){
                        uni.switchTab({
                            url: userStore.loginFrom.url
                        })
                    }
                    else if(userStore.loginFrom.openType == 'navigateTo'){
                        uni.navigateTo({
                            url: userStore.loginFrom.url
                        })
                    }
                    userStore.loginFrom.url = ''
                    userStore.loginFrom.openType = ''
                }
            },2000)
            
            
        })
    })
}
function offLogin(){
    uni.showModal({
        title: '提示',
        content: '确认退出登录吗？',
        confirmColor: '#ff0000'
    }).then(res => {
       if(res.confirm){
           userStore.userInfo = {}
           userStore.token = ''
           uni.setStorageSync('userInfoData','')
           uni.setStorageSync('token','')
       }
    })
}
</script>

<style scoped lang="less">
.login {
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%,-50%);
    width: 100%;
    text-align: center;
    font-size: 5vw;
    button {
        width: 90%;
        border-radius: 10vw;
    }
}

.message {
    position: relative;
    height: 30vh;
    background-color: #bc6138;
    color: #fff;
    font-size: 5vw;
    text-align: center;
    >view:first-child {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        width: 15%;
        image {
            width: 100%;
            border: 1vw solid #fff;
            border-radius: 7.5vw;
        }
    }
}
.content {
    margin: 3vw;
    font-size: 4vw;
    .data {
        margin: 10vw 0;
        display: flex;
        text-align: center;
        >view {
            flex: 1;
        }
    }
    .buy-data-title {
        display: flex;
        justify-content: space-between;
        margin: 4vw 0;
    }
    .buy-data-title:first-child {
        margin-bottom: 2vw;
    }
    .buy-data {
        display: flex;
        margin: 8vw 0;
        text-align: center;
        >view {
            flex: 1;
            >view:first-child {
                width: 30%;
                margin: 0 auto;
                image {
                    width: 100%;
                }
            }
        }
    }
}
.off-login {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: 5vw;
    color: #fff;
    background-color: red;
}
</style>
