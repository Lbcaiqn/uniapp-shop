<template>
    <view id="Home">
        <my-search @clickSearch="toSearch" />
        <scroll-view scroll-y style="height: 90vh; width: 100%;">
            <view>
                <swiper class="swiper" v-if="data?.swiperList" autoplay circular interval="2000">
                    <swiper-item class="swiper-item" v-for="i in data?.swiperList" :key="i.goods_id">
                        <navigator 
                        :url="'/packageA/GoodsDetail/GoodsDetail?goods_id=' + i.goods_id"
                        :open-type="i.open_type"
                        >
                            <image :src="i.image_src" mode="widthFix"></image>
                        </navigator>
                    </swiper-item>
                </swiper>
                
                
            </view>
            <view class="navList" v-if="data?.navList">
                <view 
                v-for="(i,iIndex) in data?.navList" 
                :key="iIndex"
                @click="clickNav(i.name)"
                >
                
                    <image :src="i.image_src" mode="widthFix"></image>
                </view>
            </view>
            <view class="floorList" v-if="data?.floorList">
                <view 
                class="floorListItem"
                v-for="(i,iIndex) in data?.floorList"
                :key="iIndex"
                >
                    <view class="floorName"><image :src="i?.floor_title?.image_src" mode="widthFix"></image></view>
                    <view class="floorImage">
                        <view class="floorImageItem">
                            <navigator :url="i?.product_list[0].url">
                                <image
                                :src="i?.product_list[0].image_src" 
                                mode="widthFix"
                                >
                                </image>
                            </navigator>
                        </view>
                        <view class="floorImageItem right">
                            <navigator :url="j.url" v-show="jIndex != 0" v-for="(j,jIndex) in i?.product_list" :key="kIndex">
                              
                                  <image
                                  v-if="jIndex != 0" 
                                  :src="j.image_src" 
                                  mode="aspectFile"
                                  >
                                   </image>
                              </navigator>
                            
                        </view>
                    </view>
                </view>
            </view>
            
        </scroll-view>
        
    </view>
</template>

<script setup>
import {ref,reactive} from 'vue'
import useBadge from '../../hooks/useBadge.js'
useBadge()
function toSearch(){
    uni.navigateTo({url:'/packageA/Search/Search'})
}

let data = reactive({})
uni.$http.get('/api/public/v1/home/swiperdata').then(res => {
    if(res.data.meta.status != 200){
        uni.$showToast()
        return
    }
    else    data.swiperList = res.data.message  
})

uni.$http.get('/api/public/v1/home/catitems').then(res => {
    if(res.data.meta.status != 200){
        uni.$showToast()
        return
    }
    else    data.navList = res.data.message  
})
function clickNav(i){
    if(i == '分类')   uni.switchTab({url: '/pages/Classification/Classification'})
}

uni.$http.get('/api/public/v1/home/floordata').then(res => {
    if(res.data.meta.status != 200){
        uni.$showToast()
        return
    }
    else    data.floorList = res.data.message  
    data.floorList.forEach((item) => {
        item.product_list.forEach((i,iIndex,iList) => {
            iList[iIndex].url = '/packageA/GoodsCart/GoodsCart?' + i.navigator_url.split('?')[1]
        })
    })
    
})
</script>

<style scoped lang="less">
.swiper {
    width: 100%;
    .swiper-item {
        width: 100%;
    }
}
.navList {
    display: flex;
    margin: 7vw 0;
    view {
        flex: 1;
        image {
            width: 100%;
        }
    }
}
.floorListItem {
    margin-bottom: 5vw;
}
.floorImage {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 2vw;
    
    image {
        width: 100%;
        height: 90%;
    }
    .floorImageItem {
        width: 32%;
    }
    .right {
        width: 62%;
        
        display: flex;
        justify-content: space-around;
        align-content: space-around;
        align-content: space-around;
        flex-wrap: wrap;
        >navigator {
            width: 45%;
            height: 25vw;
            
            
        }
    }
}
</style>
