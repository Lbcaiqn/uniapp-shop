<template>
    <view id="Classification">
        <my-search @clickSearch.native="toSearch" />
        <view v-if="data?.cateList" class="ScrollArea" style="display: flex;">
            <scroll-view class="ScrollLeft" scroll-y style="height: 90vh; width: 25%;">
                <view 
                class="ScrollLeftItem" 
                :class="{'active':isActive == iIndex}" 
                v-for="(i,iIndex) in data?.cateList" 
                :key="i.cat_id"
                @click="activeChange(iIndex)"
                >
                    {{i.cat_name}}
                </view>
            </scroll-view>
            <scroll-view class="ScrollRight" scroll-y :scroll-top="scrollTop" style="height: 90vh; width: 75%;">
                <view class="secondCate" v-for="i in data?.cateList[isActive]?.children" :key="i.cat_id">
                    <view class="title">{{i.cat_name}}</view>
                    <view class="thirdCate">
                        <view class="cate" v-for="j in i.children" :key="j.cat_id" @click="toGoodsCart(j.cat_id)">
                            <view class="cateIcon"><image :src="j.cat_icon" mode="widthFix"></image></view>
                            <view class="cateName">{{j.cat_name}}</view>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<script setup>
import {ref,reactive} from 'vue'
import useBadge from '../../hooks/useBadge.js'
useBadge()

let data = reactive({}), isActive = ref(0), scrollTop = ref(0)
uni.$http.get('/api/public/v1/categories').then(res => {
    if(res.data.meta.status != 200){
        uni.$showToast()
        return
    }
    else    data.cateList = res.data.message  
    
})
function activeChange(i){
    if(isActive.value != i){
        isActive.value = i
        scrollTop.value = scrollTop.value == 0 ? 0.01 : 0
    }
}
function toGoodsCart(cid){
    uni.navigateTo({
        url: '/packageA/GoodsCart/GoodsCart?cid' + cid
    })
}
function toSearch(){
    uni.navigateTo({url:'/packageA/Search/Search'})
}
</script>

<style scoped lang="less">
    .ScrollLeftItem {
        height: 10vh;
        line-height: 10vh;
        text-align: center;
        font-size: 4vw;
    }
.active {
    position: relative;
    color: red;
    &::before {
        display: block;
        content: "";
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        position: absolute;
        width: 5%;
        height: 70%;
        background-color: red;
    }
}
.secondCate {
    margin: 5vw 0;
    .title {
        font-size: 5vw;
        height: 10vw;
        line-height: 10vw;
        text-align: center;
    }
    .thirdCate {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-content: space-around;
        .cate {
            margin-bottom: 5vw;
            width: 47%;
            .cateIcon {
                image {
                    width: 100%;
                }
            }
            .cateName {
                font-size: 5vw;
                height: 6vw;
                line-height: 6vw;
                text-align: center;
            }
        }
    }
}
</style>
