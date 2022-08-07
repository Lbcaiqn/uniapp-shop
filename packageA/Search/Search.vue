<template>
    <view>
        <view class="search-box">
            <uni-search-bar @input="input" :radius="100" cancelButton="none" :focus="true"></uni-search-bar>
        </view>
        
        <view>
            <scroll-view scroll-y style="height: 90vh; width: 100%">
                <view class="search-history" v-show="data?.list?.length == 0">
                    <view class="search-history-title">
                        <view>搜索历史</view>
                        <view @click="deleteHistory"><uni-icons type="trash" size="18"></uni-icons></view>
                    </view>
                    <view class="search-history-content">
                        <view v-for="(i,iIndex) in historyData" :key="iIndex" @click="toGoodsCart(i)">{{i}}</view>
                    </view>
                </view>
                
                <view 
                v-if="data?.list?.length != 0"
                class="search-item"
                v-for="i in data?.list"
                :key="i?.goods_id"
                @click="toGoodsDetail(i?.goods_id)"
                >
                   <view class="search-item-name">{{i?.goods_name}}</view>
                    <view class="search-item-icon">
                        -》
                    </view>
                </view>
            </scroll-view>
        </view>
    
    
    </view>
</template>

<script setup>
import {ref,reactive,computed} from 'vue'
let timer = null
function debunce(func,delay){
    return function(){
        if(timer) clearTimeout(timer)
        timer = setTimeout(() => {
            func()
        },delay)
    }
}

let data = reactive({list: []}), history, historyData
if(uni.getStorageSync('searchHistory') != ''){
    history = reactive(new Set(JSON.parse(uni.getStorageSync('searchHistory')).reverse()))
    historyData = ref(JSON.parse(uni.getStorageSync('searchHistory')))
}
else {
    history = reactive(new Set())
    historyData = ref([])
}

function deleteHistory(){
    history.clear()
    historyData.value = []
    uni.setStorageSync('searchHistory','')
}
function input(e){
    debunce(() => {
        if(e == '') data.list = []
        else {
            history.delete(e)
            history.add(e)
            historyData.value = [...history].reverse()
            uni.setStorageSync('searchHistory',JSON.stringify(reactive(historyData.value)))
            
            uni.$http.get('/api/public/v1/goods/qsearch',{query: e}).then(res => {
                if(res.data.meta.status != 200){
                    uni.$showToast()
                    return
                }
                else    data.list = res.data.message
                
            })
        }
    },500)()
}
function toGoodsDetail(id){
    uni.navigateTo({
        url: '/packageA/GoodsDetail/GoodsDetail?goods_id' + id
    })
}

function toGoodsCart(i){
    uni.navigateTo({
        url: '/packageA/GoodsCart/GoodsCart?query=' + i
    })
}

</script>

<style scoped lang="less">
.search-box {
    height: 10vh;
    background-color: #000;
}

.search-item {
    display: flex;
    padding: 2vh;
    height: 6vh;
    line-height: 6vh;
    font-size: 3vh;
    .search-item-name {
        width: 90%;
        white-space: nowrap;
        overflow: hidden;  
        text-overflow: ellipsis;
    }
    .search-item-icon {
        width: 10%;
    }
}
.search-history {
    margin: 3vw;
    .search-history-title {
        display: flex;
        justify-content: space-between;
        
    }
    .search-history-content {
        display: flex;
        flex-wrap: wrap;
        >view {
            // flex: 1;
            // width: 20%;
            margin: 3vw;
            padding: 2vw 5vw;
            text-align: center;
            font-size: 3vw;
            background-color: rgba(0,0,0,0.2);
            border-radius: 3vw;
            white-space: nowrap;
            overflow: hidden;  
            text-overflow: ellipsis;
        }
    }
}
</style>
